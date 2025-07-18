import { NextRequest, NextResponse } from 'next/server'
import { getPayload, Where } from 'payload'
import configPromise from '@payload-config'

type RouteParams = {
  id: string // Assuming 'id' is your dynamic segment
}
export async function GET(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id
    const payload = await getPayload({ config: configPromise })

    const listings = await payload.findByID({
      collection: 'listings',
      id: id,
      select: {
        title: true,
        featuredImage: true,
        slug: true,
        streetAddress: true,
        price: true,
        textAfterPrice: true,
        transactionType: true,
        category: true,
        MLS: {
          ListOfficeName: true,
        },
      },
    })
    return NextResponse.json({ ok: true, listing: listings, error: null }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { ok: false, listing: null, error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
