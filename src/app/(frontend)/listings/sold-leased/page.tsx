import 'mapbox-gl/dist/mapbox-gl.css'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { Metadata } from 'next'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { PageClient } from './page.client'
import { MAP_PAGINATION_LIMIT } from '@/utilities/constants'
import { MapFilters } from '../map/page.client'

export default async function Page({ searchParams: searchParamsPromise }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await searchParamsPromise
  const { page, sort, ...filters } = searchParams
  const payload = await getPayload({
    config: configPromise,
  })
  const listingsResponse = await payload.find({
    collection: 'listings',
    ...(sort ? {
      sort: sort.split(','),
    } : {}),
    ...(page ? { page: Number(page) } : {}),
    where: {
      and: [
        {
          availability: {
            equals: 'sold',
          },
        },
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
      ],
    },
    ...(MAP_PAGINATION_LIMIT ? { limit: MAP_PAGINATION_LIMIT } : {}),
  })
  return (
    <Suspense fallback={LoadingState()}>
      <div className=' border-b border-brand-gray-01 bg-brand-navy'>
        <div className="container py-16 md:py-16 flex flex-col gap-16 md:gap-20">
          <div
            className={`flex flex-col -4 md:gap-4 md:items-center`}
          >
            <h2
              className={`text-[2.5rem] font-bold text-white flex-1 text-center`}
            >
              Sold and Leased Listings
            </h2>

          </div>
        </div>
      </div>
      <PageClient listings={listingsResponse} />
    </Suspense>
  )
}

const LoadingState = () => {
  return (
    <div>
      <div className="w-full border-t border-gray-100 grid grid-cols-5">
        <div
          className={`col-span-2 grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] xl:grid-cols-2 overflow-scroll  gap-x-4 gap-y-6 p-6 content-start bg-white`}
        >
          {Array.from(Array(4).keys()).map((_, index) => {
            return (
              <Card key={index} className="rounded-none bg-white border-none shadow-md">
                <div className="relative pb-[66.66%] overflow-hidden w-full">
                  <Skeleton className="absolute w-full h-full top-0 left-0" />
                </div>
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex justify-between gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                      <div>
                        <Skeleton className="w-full h-8" />
                      </div>

                      <Skeleton className="w-full h-6" />
                      <Skeleton className="w-full h-6" />
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {

  const title = 'Sold and Leased Listings | Onward Real Estate Team';
  const description = 'Browse past sold and leased commercial real estate listings from Onward Real Estate Team.'
  return {
    description: description,
    openGraph: mergeOpenGraph({
      description: description,
      title,
      url: '/listings/sold-leased',
    }),
    title,
  }
}