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

    console.log('LIMIT: ' + limit)
    console.log('OFFSET: ' + offset)

    // const payload = await getPayload({ config: configPromise })
    // const existingListings = await payload
    //   .find({
    //     collection: 'listings',
    //     pagination: false,
    //   })
    //   .then((res) => res.docs)
    // const existingMedia = await payload
    //   .find({
    //     collection: 'media',
    //     pagination: false,
    //   })
    //   .then((res) => res.docs)
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
    const batchedListings = await Promise.all(
      retsListings.map(async (retsListing) => {
        const existingListing = await findExistingListing(retsListing.ListingKeyNumeric)
        if (existingListing) {
          const startOfDay = new Date()
          startOfDay.setHours(0, 0, 0, 0)

          const updatedListing = await payload.update({
            collection: 'listings',
            id: existingListing.id,
            data: {
              MLS: {
                ...existingListing.MLS,
                LastSeenAt: startOfDay.toISOString(),
              },
            },
          })
          console.log(
            'UPDATED LASTSEENAT FOR LISTING: ' +
              existingListing.title +
              ' TO: ' +
              updatedListing.MLS?.LastSeenAt,
          )
          return { existingListing: existingListing, retsListing: retsListing }
        } else {
          return { existingListing: undefined, retsListing: retsListing }
        }
      }),
    ).then((res) =>
      res.filter((batchedListing) => {
        if (batchedListing.existingListing) {
          console.log(
            'LISTING ALREADY EXISTS, CHECKING FOR UPDATE: ' + batchedListing.existingListing.title,
          )
          return checkNeedsUpdate(batchedListing.existingListing, batchedListing.retsListing)
        }
        return true
      }),
    )

    console.log('BATCHING ' + batchedListings.length + ' LISTINGS\n\n')

    for (let i = 0; i < batchedListings.length; i += BATCH_SIZE) {
      const batchNum = Math.floor(i / BATCH_SIZE)
      console.log('RUNNING BATCH: ' + (batchNum + 1))

      const batchResults = await Promise.all(
        batchedListings.slice(i, i + BATCH_SIZE).map(async (batchedListing) => {
          return new Promise<Listing | undefined>((resolve) => {
            setTimeout(async () => {
              try {
                if (batchedListing.existingListing) {
                  console.log('UPDATING LISTING: ' + batchedListing.existingListing.title)
                  const updatedListing = await updateListing(
                    batchedListing.existingListing,
                    batchedListing.retsListing,
                  )
                  resolve(updatedListing)
                } else {
                  const createdListing = await createListing(batchedListing.retsListing)
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
