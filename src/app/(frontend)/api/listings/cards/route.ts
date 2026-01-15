import { NextRequest, NextResponse } from 'next/server'
import { getPayload, Where } from 'payload'
import configPromise from '@payload-config'
import { MapFilters } from '../types'
import { MAP_PAGINATION_LIMIT } from '@/utilities/constants'
import { sanitizeFilterData } from '@/utilities/sanitizeFilterData'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { searchParams } = new URL(req.url)
    const filters: MapFilters = searchParams.get('filters')
      ? JSON.parse(searchParams.get('filters') as string)
      : undefined

    const propertyTypes = await payload
      .find({
        collection: 'property-types',
        limit: 50,
        select: {
          title: true,
        },
      })
      .then((res) => res.docs)

    const sanitized = sanitizeFilterData(filters)
    if (
      sanitized.propertyType &&
      !propertyTypes.map((pt) => pt.id).includes(Number(sanitized.propertyType))
    ) {
      sanitized.propertyType = undefined
    }

    const page = searchParams.get('page')
    const sort = searchParams.get('sort')
    const bounds = searchParams.get('bounds') ? JSON.parse(searchParams.get('bounds')!) : undefined

    const whereQuery: Where = {
      and: [
        {
          ...(sanitized?.status
            ? {
                _status: { in: sanitized.status },
              }
            : {
                _status: { equals: 'published' },
              }),
        },
        {
          ...(sanitized?.search
            ? {
                or: [
                  { title: { like: sanitized.search } },
                  { streetAddress: { like: sanitized.search } },
                  { city: { like: sanitized.search } },
                  { state: { like: sanitized.search } },
                  { zipCode: { like: sanitized.search } },
                ],
              }
            : {}),
        },
        {
          or: [
            { price: { exists: false } },
            {
              and: [
                {
                  price: {
                    greater_than_equal: sanitized?.minPrice ? Number(sanitized.minPrice) : 0,
                  },
                },
                {
                  price: {
                    less_than_equal: sanitized?.maxPrice ? Number(sanitized.maxPrice) : Infinity,
                  },
                },
              ],
            },
          ],
        },
        {
          ...(sanitized?.sizeType && sanitized.sizeType === 'sqft'
            ? {
                and: [
                  {
                    area: { greater_than_equal: sanitized.minSize ? Number(sanitized.minSize) : 0 },
                  },
                  {
                    area: {
                      less_than_equal: sanitized.maxSize ? Number(sanitized.maxSize) : Infinity,
                    },
                  },
                ],
              }
            : sanitized?.sizeType && sanitized.sizeType === 'acres'
              ? {
                  and: [
                    {
                      acreage: {
                        greater_than_equal: sanitized.minSize ? Number(sanitized.minSize) : 0,
                      },
                    },
                    {
                      acreage: {
                        less_than_equal: sanitized.maxSize ? Number(sanitized.maxSize) : Infinity,
                      },
                    },
                  ],
                }
              : {}),
        },
        {
          ...(sanitized?.transactionType &&
          (sanitized.transactionType === 'for-sale' || sanitized.transactionType === 'for-lease')
            ? { transactionType: { equals: sanitized.transactionType } }
            : {}),
        },
        {
          ...(sanitized?.propertyType && sanitized.propertyType !== 'all'
            ? { 'propertyType.id': { equals: sanitized.propertyType } }
            : {}),
        },
        {
          ...(sanitized?.category && sanitized.category !== 'all'
            ? { category: { equals: sanitized.category } }
            : {}),
        },
        {
          ...(sanitized?.availability
            ? { availability: { equals: sanitized.availability } }
            : {
                availability: { in: ['available', 'active'] },
              }),
        },
        {
          ...(bounds
            ? {
                coordinates: {
                  within: {
                    type: 'Polygon',
                    coordinates: [bounds],
                  },
                },
              }
            : {}),
        },
      ],
    }

    const listings = await payload.find({
      collection: 'listings',
      ...(MAP_PAGINATION_LIMIT ? { limit: MAP_PAGINATION_LIMIT } : {}),
      ...(page ? { page: Number(page) } : {}),
      where: whereQuery,
      ...(sort ? { sort: sort.split(',') } : {}),
    })

    return NextResponse.json({ ok: true, listings: listings, error: null }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { ok: false, listings: null, error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
