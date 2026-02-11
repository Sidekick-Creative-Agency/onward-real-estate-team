import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { fetchRETSListing } from '../../cron/functions/fetchRETSListing'

export async function GET(req: NextRequest) {
  try {
    const headers = req.headers
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
    const listingsWithoutListingId = await payload.find({
      collection: 'listings',
      limit: 100,
      where: {
        'MLS.ListingId': { equals: null },
      },
    })
    const fixedListings = await Promise.all(
      listingsWithoutListingId.docs.map(async (listing) => {
        if (!listing.title) {
          console.log('Listing without title, skipping ListingId fix. ID: ' + listing.id)
          return null
        }
        if (!listing.MLS?.ListingKeyNumeric) {
          console.log(
            'Listing without ListingKeyNumeric, skipping ListingId fix. ID: ' + listing.id,
          )
          return null
        }
        const retsListing = await fetchRETSListing(listing.MLS?.ListingKeyNumeric)
        const updatedListing = await payload.update({
          collection: 'listings',
          id: listing.id,
          data: {
            MLS: {
              // @ts-expect-error ListingId exists on Listing.MLS
              ListingId: retsListing?.ListingId ? retsListing.ListingId : undefined,
            },
          },
        })
        // @ts-expect-error ListingId exists on Listing.MLS
        return { id: listing.id, listingId: updatedListing.MLS?.ListingId }
      }),
    ).then((results) => results.filter((item) => item !== null))
    return NextResponse.json(
      { ok: true, fixedListings: fixedListings, error: null },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { ok: false, fixedListings: null, error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
