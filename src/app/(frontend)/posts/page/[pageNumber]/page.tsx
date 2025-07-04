import type { Metadata } from 'next/types'

import { CollectionArchiveGrid } from '@/components/CollectionArchive/GridArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound, redirect } from 'next/navigation'
import { PostCard } from '@/components/Posts/PostCard'

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

  // if (!Number.isInteger(sanitizedPageNumber)) notFound()
  if (!Number.isInteger(sanitizedPageNumber)) redirect('/posts')

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 24,
    page: sanitizedPageNumber,
    overrideAccess: false,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16 flex flex-col gap-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {posts && posts.docs && posts.docs.map((post, index) => {
            return (
              <PostCard key={index} post={post} />
            )
          })}

        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={24}
          totalDocs={posts.totalDocs}
        />
      </div>

      {/* <CollectionArchiveGrid posts={posts.docs} /> */}

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} collection='posts' />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Posts Page ${pageNumber || ''} | Onward Real Estate Team`,
  }
}

export async function generateStaticParams() {
  if (process.env.ENV !== 'development') {
    const payload = await getPayload({ config: configPromise })
    const posts = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 10,
      draft: false,
      overrideAccess: false,
    })

    const pages: { pageNumber: string }[] = []

    for (let i = 1; i <= posts.totalPages; i++) {
      pages.push({ pageNumber: String(i) })
    }

    return pages
  }
  return []
}
