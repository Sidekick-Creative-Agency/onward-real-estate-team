import { formatSlug } from '@/fields/Slug/formatSlug'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

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
    const listingsWithoutSlug = await payload.find({
      collection: 'listings',
      limit: 100,
      where: {
        slug: { equals: null },
      },
    })
    const fixedListings = await Promise.all(
      listingsWithoutSlug.docs.map(async (listing) => {
        if (!listing.title) {
          console.log('Listing without title, skipping slug fix. ID: ' + listing.id)
          return null
        }
        console.log('Fixing listing without slug:', listing.title)
        const newSlug = formatSlug(listing.title)
        const updatedListing = await payload.update({
          collection: 'listings',
          id: listing.id,
          data: { slug: newSlug },
        })
        return { id: listing.id, slug: updatedListing.slug }
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
