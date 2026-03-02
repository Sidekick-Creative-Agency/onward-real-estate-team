import { fetchRETSListings } from '../functions/fetchRETSListings'
import { findExistingListing } from '../functions/findExistingListing'
import { updateListing } from '../functions/updateListing'
import { createListing } from '../functions/createListing'
import { Listing } from '@/payload-types'
import { checkNeedsUpdate } from '../functions/checkNeedsUpdate'
import { NextRequest } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { fetchRETSListing } from '../functions/fetchRETSListing'

export const maxDuration = 300

const mlsStatusLookup = {
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
  Closed: 'unavailable',
  Withdrawn: 'unavailable',
}
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

    const listings = await payload.find({
      collection: 'listings',
      limit: limit ? Number(limit) : undefined,
      page: offset ? Math.floor(Number(offset) / 100) + 1 : undefined,
      where: {
        and: [
          {
            'MLS.ListingKeyNumeric': {
              exists: true,
            },
          },
          {
            or: [
              {
                and: [
                  {
                    'MLS.LastSeenAt': {
                      exists: false,
                    },
                  },
                  {
                    availability: {
                      in: ['active', 'available'],
                    },
                  },
                ],
              },
              {
                'MLS.LastSeenAt': {
                  less_than: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(), // LastSeenAt is older than 3 days
                },
              },
            ],
          },
        ],
      },
    })

    const listingsWithRets = await Promise.all(
      listings.docs.map(async (listing) => {
        const retsListing = await fetchRETSListing(listing.MLS?.ListingKeyNumeric)
        if (retsListing) {
          return {
            ...listing,
            rets: {
              ...retsListing,
            },
          }
        }
        return null
      }),
    ).then((results) => results.filter((listing) => listing !== null))

    const listingsWithoutRets = listings.docs.filter((listing) => {
      return !listingsWithRets.find(
        (listingWithRets) =>
          listingWithRets.MLS?.ListingKeyNumeric === listing.MLS?.ListingKeyNumeric,
      )
    })

    const updatedListings: Listing[] = []

    for (const [index, listing] of listingsWithRets.entries()) {
      console.log('WITH RETS INDEX:', index)
      const updatedListing = await payload.update({
        collection: 'listings',
        id: listing.id,
        data: {
          availability: listing.rets.MlsStatus
            ? mlsStatusLookup[listing.rets.MlsStatus] || 'unavailable'
            : 'unavailable',
          MLS: {
            ...listing.MLS,
            MlsStatus: listing.rets.MlsStatus,
            LastSeenAt: new Date().toISOString(),
          },
        },
      })

      updatedListings.push(updatedListing)
    }

    for (const [index, listing] of listingsWithoutRets.entries()) {
      console.log('WITHOUT RETS INDEX:', index)
      const updatedListing = await payload.update({
        collection: 'listings',
        id: listing.id,
        data: {
          availability: 'unavailable',
        },
      })

      updatedListings.push(updatedListing)
    }

    return new Response(
      JSON.stringify({
        totalListings: listings.totalDocs,
        existingRetsListings: listingsWithRets.length,
        nonExistingRetsListings: listingsWithoutRets.length,
        updatedListings: updatedListings.map((listing) => ({
          id: listing.id,
          title: listing.title,
          availability: listing.availability,
        })),
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
