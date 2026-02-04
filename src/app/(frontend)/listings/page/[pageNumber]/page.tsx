import type { Metadata } from 'next/types'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { ListingCard } from '@/components/Listings/ListingCard'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const listings = await payload.find({
    collection: 'listings',
    depth: 1,
    limit: 48,
    page: sanitizedPageNumber,
    overrideAccess: false,
  })

  return (
    <div className="pt-24 pb-24">
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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Onward Real Estate Team Posts Page ${pageNumber || ''}`,
  }
}

// export async function generateStaticParams() {
//   if (process.env.ENV !== 'development') {
//     const payload = await getPayload({ config: configPromise })
//     const listings = await payload.find({
//       collection: 'listings',
//       depth: 0,
//       limit: 10,
//       draft: false,
//       overrideAccess: false,
//     })

//     const pages: { pageNumber: string }[] = []

//     for (let i = 1; i <= listings.totalPages; i++) {
//       pages.push({ pageNumber: String(i) })
//     }

//     return pages
//   }
//   return []
// }
