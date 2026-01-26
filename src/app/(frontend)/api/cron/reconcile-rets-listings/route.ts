import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest } from 'next/server'
import { fetchRETSListingStatus } from '../functions/fetchRETSListingStatus'

export async function GET(request: NextRequest) {
  try {
    const headers = request.headers
    const cronSecret = process.env.CRON_SECRET
    const authSecret = headers.get('Authorization')?.split(' ')[1]

    if (cronSecret !== authSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const payload = await getPayload({ config: configPromise })

    const startOfToday = new Date()
    startOfToday.setUTCHours(0, 0, 0, 0)

    const stale = await payload.find({
      collection: 'listings',
      pagination: false,
      where: {
        and: [
          { 'MLS.ListingKeyNumeric': { exists: true } },
          {
            or: [
              {
                'MLS.LastSeenAt': {
                  less_than: startOfToday.toISOString(),
                },
              },
              {
                'MLS.LastSeenAt': { exists: false },
              },
            ],
          },
        ],
      },
    })

    await Promise.all(
      stale.docs.map(async (doc) => {
        const listingStatus = await fetchRETSListingStatus(doc.MLS?.ListingKeyNumeric!)
        return listingStatus
        // const updatedListing = await payload.update({
        //   collection: 'listings',
        //   id: doc.id,
        //   data: {
        //     'MLS.MlsStatus': listingStatus?.MlsStatus || 'Closed',
        //   },
        // })
        // console.log(`Updated listing ${doc.title} with status ${listingStatus?.MlsStatus}`)
        // return updatedListing
      }),
    )

    return new Response(JSON.stringify({ updated: stale.totalDocs }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('ERROR RECONCILING LISTINGS:', error)
    return new Response(JSON.stringify({ error: 'Reconcile failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
