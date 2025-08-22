import type { Metadata } from 'next/types'

import { CollectionArchiveGrid } from '@/components/CollectionArchive/GridArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { ListingArchiveGrid } from '@/components/Archive/ListingArchive'
import { ListingCard } from '@/components/Listings/ListingCard'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export const dynamic = 'force-static'
export const revalidate = 3600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const listings = await payload.find({
    collection: 'listings',
    depth: 1,
    limit: 48,
    overrideAccess: false,
  })

  return (
    <div className="py-28">
      <PageClient />
      <div className="container mb-16 flex flex-col gap-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Listings</h1>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {listings && listings.docs && listings.docs.map((listing, index) => {
            return (
              <ListingCard key={index} listing={listing} />
            )
          })}

        </div>
      </div>


      <div className="container mb-8">
        <PageRange
          collection="listings"
          currentPage={listings.page}
          limit={48}
          totalDocs={listings.totalDocs}
        />
      </div>

      {/* <CollectionArchiveGrid posts={listings.docs} /> */}

      <div className="container">
        {listings.totalPages > 1 && listings.page && (
          <Pagination page={listings.page} totalPages={listings.totalPages} collection='listings' />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  const title = 'Listings | Onward Real Estate Team';
  const description = 'Browse commercial and residential listings from Onward Real Estate Team.'
  return {
    description: description,
    openGraph: mergeOpenGraph({
      description: description,
      title,
      url: '/listings',
    }),
    title,
  }
}