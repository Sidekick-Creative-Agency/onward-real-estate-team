import { NextRequest, NextResponse } from 'next/server'
import { getPayload, Where } from 'payload'
import configPromise from '@payload-config'
import { MapFilters } from '../types'
import { MAP_PAGINATION_LIMIT } from '@/utilities/constants'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const filters: MapFilters = searchParams.get('filters')
      ? JSON.parse(searchParams.get('filters') as string)
      : undefined
    const page = searchParams.get('page')
    const sort = searchParams.get('sort')
    const bounds = searchParams.get('bounds') ? JSON.parse(searchParams.get('bounds')!) : undefined

    const payload = await getPayload({ config: configPromise })

    const whereQuery: Where = {
      and: [
        { _status: { equals: 'published' } },
        { availability: { in: ['available', 'active'] } },
        {
          ...(filters?.search
            ? {
                or: [
                  { title: { like: filters.search } },
                  { streetAddress: { like: filters.search } },
                  { city: { like: filters.search } },
                  { state: { like: filters.search } },
                  { zipCode: { like: filters.search } },
                ],
              }
            : {}),
        },
        {
          or: [
            { price: { exists: false } },
            {
              and: [
                { price: { greater_than_equal: filters?.minPrice ? Number(filters.minPrice) : 0 } },
                {
                  price: {
                    less_than_equal: filters?.maxPrice ? Number(filters.maxPrice) : Infinity,
                  },
                },
              ],
            },
          ],
        },
        {
          ...(filters?.sizeType && filters.sizeType === 'sqft'
            ? {
                and: [
                  { area: { greater_than_equal: filters.minSize ? Number(filters.minSize) : 0 } },
                  {
                    area: { less_than_equal: filters.maxSize ? Number(filters.maxSize) : Infinity },
                  },
                ],
              }
            : filters?.sizeType && filters.sizeType === 'acres'
              ? {
                  and: [
                    {
                      acreage: {
                        greater_than_equal: filters.minSize ? Number(filters.minSize) : 0,
                      },
                    },
                    {
                      acreage: {
                        less_than_equal: filters.maxSize ? Number(filters.maxSize) : Infinity,
                      },
                    },
                  ],
                }
              : {}),
        },
        {
          ...(filters?.transactionType &&
          (filters.transactionType === 'for-sale' || filters.transactionType === 'for-lease')
            ? { transactionType: { equals: filters.transactionType } }
            : {}),
        },
        {
          ...(filters?.propertyType && filters.propertyType !== 'all'
            ? { 'propertyType.id': { equals: filters.propertyType } }
            : {}),
        },
        {
          ...(filters?.category && filters.category !== 'all'
            ? { category: { equals: filters.category } }
            : {}),
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
