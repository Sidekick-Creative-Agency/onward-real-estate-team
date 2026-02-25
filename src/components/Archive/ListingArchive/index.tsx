'use client'
import React, { useState } from 'react'
import { DataFromCollectionSlug, PaginatedDocs, Where } from 'payload'
import { ListingCard } from '@/components/Listings/ListingCard'
import { Listing } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { stringify } from 'qs-esm'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface ListingArchiveGridProps {
  data: DataFromCollectionSlug<'listings'>[]
  enableCategoryFilters?: boolean | undefined | null
  defaultCategoryFilter?: 'all' | 'commercial' | 'residential' | undefined | null
  limit?: number | undefined | null
}

export const ListingArchiveGrid: React.FC<ListingArchiveGridProps> = ({
  data,
  enableCategoryFilters,
  defaultCategoryFilter,
  limit,
}) => {
  const [activeFilter, setActiveFilter] = useState(defaultCategoryFilter || null)
  const [activeListings, setActiveListings] = useState<Listing[]>(data || [])
  const [isLoading, setIsLoading] = useState(false)

  const handleFilterChange = async (filter: 'commercial' | 'residential') => {
    try {
      setIsLoading(true)
      setActiveFilter(filter)

      const query: Where = {
        category: {
          equals: filter,
        },
        ...((activeFilter === 'residential' || activeFilter === 'all') && {
          or: [{
            'MLS.ListOfficeName': {
              equals: process.env.NEXT_PUBLIC_RETS_LIST_OFFICE_NAME || ''
            }
          },
          {
            'MLS.ListOfficeName': {
              exists: false
            }
          }
          ]
        })
      }
      const stringifiedQuery = stringify(
        {
          where: query,
          limit: limit || 10,
        },
        { addQueryPrefix: true },
      )
      const response = await fetch(`/api/listings${stringifiedQuery}`)
      const json = (await response.json()) as PaginatedDocs<Listing>
      if (json.docs) {
        setActiveListings(json.docs)
      } else {
        console.error('Failed to fetch listings')
      }
    } catch (error: any) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={`relative ${enableCategoryFilters && 'pt-20 md:py-0'}`}>
      <Carousel
        className="flex justify-center [&>div]:w-full [&>div]:px-4"
        opts={{ align: 'start' }}
      >
        <CarouselContent className="flex gap-4 w-full ">
          {activeListings?.map((listing, index) => {
            if (typeof listing === 'object' && listing !== null) {
              return (
                <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/3">
                  <div
                    className={`w-full duration-1000 ${isLoading && 'animate-pulse'}`}
                    key={listing.id}
                  >
                    <ListingCard listing={listing} />
                  </div>
                </CarouselItem>
              )
            }
            return null
          })}
        </CarouselContent>
        <CarouselPrevious className="border-none w-10 h-10 p-2 flex justify-center items-center hover:bg-transparent hover:text-brand-navy focus-visible:ring-brand-navy focus-visible:ring-offset-2 [&_svg]:max-h-full top-[calc(100%+1rem)] left-auto right-12 translate-y-0 sm:top-1/2 sm:-translate-y-1/2 sm:-left-8 xl:-left-12" />
        <CarouselNext className="border-none w-10 h-10 p-2 flex justify-center items-center hover:bg-transparent hover:text-brand-navy focus-visible:ring-brand-navy focus-visible:ring-offset-2 [&_svg]:max-h-full  top-[calc(100%+1rem)] left-auto right-0 translate-y-0 sm:top-1/2 sm:-translate-y-1/2 sm:-right-8 xl:-right-12" />
      </Carousel>
      {enableCategoryFilters && (
        <div className="absolute left-0 right-auto -translate-y-1/2 md:right-0 md:left-auto top-0 md:bottom-[calc(100%+5rem)] md:top-auto md:translate-y-0 flex flex-wrap gap-2 sm:gap-6 gap-y-0">
          <Button
            onClick={() => handleFilterChange('commercial')}
            className={`px-2 py-4 text-lg font-bold leading-none tracking-wider bg-transparent hover:bg-transparent focus-visible:bg-transparent border-0 border-b ${activeFilter === 'commercial' ? 'border-brand-tan text-brand-navy' : 'border-brand-gray-01 text-brand-gray-03'} `}
          >
            Commercial
          </Button>
          <Button
            onClick={() => handleFilterChange('residential')}
            className={`px-2 py-4 text-lg font-bold leading-none tracking-wider bg-transparent hover:bg-transparent focus-visible:bg-transparent border-0 border-b ${activeFilter === 'residential' ? 'border-brand-tan text-brand-navy' : 'border-brand-gray-01 text-brand-gray-03'} `}
          >
            Residential
          </Button>
        </div>
      )}
    </div>
  )
}
