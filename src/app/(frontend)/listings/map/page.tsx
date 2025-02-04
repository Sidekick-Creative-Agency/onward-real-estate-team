import 'mapbox-gl/dist/mapbox-gl.css'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageClient } from './page.client'
import { Suspense } from 'react'
import { searchFields } from '../../../../search/fieldOverrides'
import { filterMapListings } from '../../api/filterMapListings'
import { FilterBar } from '@/components/Map/filterBar'

import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default async function Page({ searchParams }) {
  // const awaitedSearchParams = await searchParams

  // const search = awaitedSearchParams.search || ''
  // const category = awaitedSearchParams.category || ''
  // const propertyType = awaitedSearchParams.property_type || ''
  // const minPrice = awaitedSearchParams.min_price || ''
  // const maxPrice = awaitedSearchParams.max_price || ''
  // const sizeType = awaitedSearchParams.size_type || ''
  // const minSize = awaitedSearchParams.min_size || ''
  // const maxSize = awaitedSearchParams.max_size || ''
  // const availability = awaitedSearchParams.availability || ''
  // const transactionType = awaitedSearchParams.transaction_type || ''

  const payload = await getPayload({
    config: configPromise,
  })
  // const listingsDocs = await filterMapListings({
  //   search,
  //   category,
  //   propertyType,
  //   minPrice,
  //   maxPrice,
  //   sizeType,
  //   minSize,
  //   maxSize,
  //   availability,
  //   transactionType,
  // })
  // const listings = listingsDocs.docs
  const listingsCount = await payload.count({ collection: 'listings' })
  return (
    <Suspense fallback={LoadingState()}>
      <PageClient listingsCount={listingsCount.totalDocs} />
    </Suspense>
  )
}

const LoadingState = () => {
  return (
    <div>
      <div className="w-full border-t border-gray-100 grid grid-cols-5">
        <div className="col-span-3 sticky top-20 h-fit">
          <div className="h-[calc(100vh-5rem)]"></div>
        </div>

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
