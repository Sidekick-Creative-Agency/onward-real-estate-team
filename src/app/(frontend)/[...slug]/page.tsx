import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import React, { cache } from 'react'

import type { Page as PageType } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { getPayload } from 'payload'
import { queryPageByUrl } from '@/utilities/queryPageByUrl'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    select: {
      slug: true
    },
    where: {
      _status: {
        equals: 'published'
      }
    }
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return [slug]
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string | string[]
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise
  const url = `/${typeof slug === 'string' ? slug : slug?.join('/')}`
  let page: PageType | null
  page = await queryPageByUrl({
    url,
  })

  if (!page) {
    // redirect('/404')
    return <PayloadRedirects url={url} />
  }

  const { hero, layout, title } = page
  return (
    <div>
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <RenderHero {...hero} title={title} />
      <RenderBlocks blocks={layout} />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const url = `/${typeof slug === 'string' ? slug : slug.join('/')}`
  let page: PageType | null
  page = await queryPageByUrl({
    url,
  })

  return generateMeta({ doc: page })
}
