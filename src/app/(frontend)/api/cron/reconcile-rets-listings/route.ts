import { Listing } from '@/payload-types'
import { NextRequest } from 'next/server'
import configPromise from '@payload-config'
import { getPayload, Where } from 'payload'
import { fetchRETSListingStatus } from '../functions/fetchRETSListingStatus'

export const maxDuration = 300

// RETS COMPACT-DECODED MlsStatus values mapped to our availability values.
// Anything not listed here (and any listing no longer found in RETS) is treated
// as unavailable.
const mlsStatusLookup: Record<string, Listing['availability']> = {
  'Active Contingent': 'active',
  Active: 'active',
  'Active KO': 'active',
  'Active Option Contract': 'active',
  Cancelled: 'unavailable',
  'Coming Soon': 'unavailable',
  Expired: 'unavailable',
  Hold: 'unavailable',
  Incomplete: 'unavailable',
  Pending: 'pending',
  Closed: 'sold',
  Withdrawn: 'unavailable',
}

export async function GET(request: NextRequest) {
  try {
    const headers = request.headers
    const cronSecret = process.env.CRON_SECRET
    const authSecret = headers.get('Authorization')?.split(' ')[1]

    if (cronSecret !== authSecret) {
      console.log('ERROR: INVALID CREDENTIALS')
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
    const payload = await getPayload({ config: configPromise })

    // Every listing in the RETS active feed has its LastSeenAt refreshed to the
    // current day by the sync-rets-listings cron (the feed is ~3.9k listings, well
    // under sync's 5k ceiling, so all active listings are covered). Any MLS-backed
    // listing whose LastSeenAt is missing or older than 3 days has therefore dropped
    // out of the active feed and needs its status re-checked against RETS.
    const threeDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
    const where: Where = {
      and: [
        {
          'MLS.ListingKeyNumeric': {
            exists: true,
          },
        },
        {
          // Only re-check currently visible listings. Listings demoted to
          // 'unavailable' below fall out of this filter; ones kept 'active'/'pending'
          // get a fresh LastSeenAt below, so neither is reprocessed on the next run.
          availability: {
            in: ['active', 'available', 'pending'],
          },
        },
        {
          or: [
            {
              'MLS.LastSeenAt': {
                exists: false,
              },
            },
            {
              'MLS.LastSeenAt': {
                less_than: threeDaysAgo,
              },
            },
          ],
        },
      ],
    }

    const candidates = await payload.find({
      collection: 'listings',
      where,
      depth: 0,
      pagination: false,
      limit: 100
    })

    const now = new Date().toISOString()
    const CHUNK_SIZE = 25 // concurrent RETS status lookups per chunk
    // Leave headroom under maxDuration so an in-flight chunk can finish and write
    // before Vercel kills the function. A large one-time backlog simply resumes on
    // the next daily run, since processed listings drop out of the candidate set.
    const deadline = Date.now() + 270000

    const counts = { active: 0, pending: 0, unavailable: 0, sold: 0 }
    let processed = 0

    for (let i = 0; i < candidates.docs.length; i += CHUNK_SIZE) {
      if (Date.now() > deadline) {
        console.warn(
          `RECONCILE: stopping at soft deadline, ${processed}/${candidates.docs.length} processed`,
        )
        break
      }

      const chunk = candidates.docs.slice(i, i + CHUNK_SIZE)
      await Promise.all(
        chunk.map(async (listing) => {
          let status: Awaited<ReturnType<typeof fetchRETSListingStatus>>
          try {
            status = await fetchRETSListingStatus(listing.MLS?.ListingKeyNumeric ?? undefined)
          } catch (error) {
            // Transient RETS failure (network/timeout/malformed). Leave availability and
            // LastSeenAt untouched so this listing stays a candidate and retries on the
            // next run, rather than being wrongly demoted to 'unavailable' and hidden.
            console.error(`RECONCILE: skipping listing ${listing.id}, RETS lookup failed:`, error)
            return
          }
          // status === null means the query succeeded but the listing is gone from RETS.
          const availability =
            (status?.MlsStatus && mlsStatusLookup[status.MlsStatus]) || 'unavailable'

          try {
            console.log(
              `RECONCILE: updating listing ${listing.id} (${listing.title}) to availability: ${availability}`,
            )
            await payload.update({
              collection: 'listings',
              id: listing.id,
              overrideLock: true,
              data: {
                availability,
                MLS: {
                  ...listing.MLS,
                  MlsStatus: status?.MlsStatus ?? listing.MLS?.MlsStatus,
                  LastSeenAt: now,
                },
              },
            })
          } catch (error) {
            // A single failed write shouldn't abort the whole run. Skip this listing;
            // it stays a candidate (LastSeenAt unchanged) and retries on the next run.
            console.error(`RECONCILE: failed to update listing ${listing.id}:`, error)
            return
          }

          counts[availability] = (counts[availability] ?? 0) + 1
          processed += 1
        }),
      )
      console.log(`RECONCILE: processed ${processed}/${candidates.docs.length}`)
    }

    return new Response(
      JSON.stringify({
        candidates: candidates.docs.length,
        processed,
        ...counts,
      }),
      {
        status: 200,
        statusText: 'Success',
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('ERROR RECONCILING LISTINGS: ' + error)
    return new Response(
      JSON.stringify({
        listings: undefined,
      }),
      {
        status: 500,
        statusText: 'Unexpected error while reconciling Listings',
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
