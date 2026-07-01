import { fetchRETSListings } from '../functions/fetchRETSListings'
import { findExistingListing } from '../functions/findExistingListing'
import { updateListing } from '../functions/updateListing'
import { createListing } from '../functions/createListing'
import { Listing } from '@/payload-types'
import { checkNeedsUpdate } from '../functions/checkNeedsUpdate'
import { NextRequest } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const maxDuration = 300

export async function GET(request: NextRequest) {
  try {
    const headers = request.headers
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams?.get('limit') || '500'
    const offset = searchParams?.get('offset') || '0'
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
    const retsListings = await fetchRETSListings(limit, offset)
    if (!retsListings) {
      return new Response(
        JSON.stringify({
          listings: undefined,
        }),
        {
          status: 200,
          statusText: 'No RETS listings found',
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
    const BATCH_SIZE = 100
    const createdOrUpdatedListings: Listing[] = []
    const precheckBatchSize = 50
    const precheckedListings: {
      existingListing?: Listing
      retsListing: (typeof retsListings)[0]
      needsUpdate: boolean
    }[] = []
    for (let i = 0; i < retsListings.length; i += precheckBatchSize) {
      const batchNum = Math.floor(i / precheckBatchSize)
      console.log('PRECHECKING BATCH: ' + (batchNum + 1))
      const batchResults = await Promise.all(
        retsListings.slice(i, i + precheckBatchSize).map(async (retsListing) => {
          let existingListing = await findExistingListing(retsListing.ListingKeyNumeric)
          if (existingListing) {
            console.log(
              'LISTING ALREADY EXISTS, CHECKING FOR UPDATE: ' + existingListing.title,
            )
            // Determine whether the listing's content needs a full re-sync. This is
            // based on ModificationTimestamp and is unaffected by the LastSeenAt write
            // below (which never changes ModificationTimestamp).
            const needsUpdate = checkNeedsUpdate(existingListing, retsListing)
            const startOfDay = new Date()
            startOfDay.setHours(0, 0, 0, 0)
            if (existingListing.MLS?.LastSeenAt !== startOfDay.toISOString()) {
              try {
                // Reassign existingListing so the fresh LastSeenAt flows through
                // updateListing()'s `...listing.MLS` spread and isn't reverted to the
                // stale value when a full update runs in the main batch map below.
                // overrideLock so a listing locked in the admin doesn't block the refresh.
                existingListing = await payload.update({
                  collection: 'listings',
                  id: existingListing.id,
                  overrideLock: true,
                  data: {
                    MLS: {
                      ...existingListing.MLS,
                      LastSeenAt: startOfDay.toISOString(),
                    },
                  },
                })
                console.log(
                  'UPDATED LAST_SEEN_AT FOR LISTING: ' +
                  existingListing.title +
                  ' TO: ' +
                  existingListing.MLS?.LastSeenAt,
                )
              } catch (error) {
                // A single failed LastSeenAt write shouldn't abort the whole offset's run.
                // Keep the original existingListing (stale LastSeenAt); it stays a reconcile
                // candidate and gets refreshed on the next run.
                console.error(
                  'FAILED TO UPDATE LAST_SEEN_AT FOR LISTING: ' + existingListing.title,
                  error,
                )
              }
            }
            return { existingListing: existingListing, retsListing: retsListing, needsUpdate }
          } else {
            return { existingListing: undefined, retsListing: retsListing, needsUpdate: true }
          }
        }),
      )
      precheckedListings.push(...batchResults)
    }

    const batchedListings = precheckedListings.filter((batchedListing) => {
      if (batchedListing.existingListing) {
        return batchedListing.needsUpdate
      }
      return true
    })

    console.log('BATCHING ' + batchedListings.length + ' LISTINGS\n\n')

    const processWithTimeout = async (
      task: Promise<Listing | undefined>,
      ms: number,
      label: string,
    ) => {
      let timeoutHandle: NodeJS.Timeout | undefined
      try {
        return await Promise.race([
          task,
          new Promise<undefined>((_, reject) => {
            timeoutHandle = setTimeout(() => {
              reject(new Error(`TIMEOUT after ${ms}ms: ${label}`))
            }, ms)
          }),
        ])
      } finally {
        if (timeoutHandle) clearTimeout(timeoutHandle)
      }
    }

    for (let i = 0; i < batchedListings.length; i += BATCH_SIZE) {
      const batchNum = Math.floor(i / BATCH_SIZE)
      console.log('RUNNING BATCH: ' + (batchNum + 1))

      const batchResults = await Promise.all(
        batchedListings.slice(i, i + BATCH_SIZE).map(async (batchedListing, index) => {
          return new Promise<Listing | undefined>((resolve) => {
            setTimeout(async () => {
              try {
                if (batchedListing.existingListing) {
                  console.log(
                    'UPDATING LISTING (' +
                    (i + index + 1) +
                    '/' +
                    batchedListings.length +
                    '): ' +
                    batchedListing.existingListing.title,
                  )
                  const updatedListing = await processWithTimeout(
                    updateListing(batchedListing.existingListing, batchedListing.retsListing),
                    30000,
                    `update:${batchedListing.existingListing.id}`,
                  )
                  console.log(
                    'FINISHED UPDATE (' +
                    (i + index + 1) +
                    '/' +
                    batchedListings.length +
                    '): ' +
                    batchedListing.existingListing.title,
                  )
                  resolve(updatedListing)
                } else {
                  console.log(
                    'CREATING LISTING (' +
                    (i + index + 1) +
                    '/' +
                    batchedListings.length +
                    '): ' +
                    batchedListing.retsListing.ListingKeyNumeric,
                  )
                  const createdListing = await processWithTimeout(
                    createListing(batchedListing.retsListing),
                    30000,
                    `create:${batchedListing.retsListing.ListingKeyNumeric}`,
                  )
                  console.log(
                    'FINISHED CREATE (' +
                    (i + index + 1) +
                    '/' +
                    batchedListings.length +
                    '): ' +
                    batchedListing.retsListing.ListingKeyNumeric,
                  )
                  resolve(createdListing)
                }
              } catch (error) {
                console.error('ERROR PROCESSING LISTING: ' + error)
                resolve(undefined)
              }
            }, 5000)
          })
        }),
      )

      // Add successful results to the collection
      createdOrUpdatedListings.push(
        ...batchResults.filter((listing): listing is Listing => listing !== undefined),
      )
    }
    return new Response(
      JSON.stringify({
        listings: createdOrUpdatedListings.map((listing) => ({
          id: listing.id,
          title: listing.title,
        })),
      }),
      {
        status: 200,
        statusText: 'Success',
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('ERROR SYNCING RETS LISTINGS: ' + error)
    return new Response(
      JSON.stringify({
        listings: undefined,
      }),
      {
        status: 500,
        statusText: 'Unexpected error while syincing RETS Listings',
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
