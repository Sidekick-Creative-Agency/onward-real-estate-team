'use client'
import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { DataFromCollectionSlug } from 'payload'

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: DataFromCollectionSlug<'posts' | 'team-members' | 'listings'>
  relationTo?: 'posts' | 'team-members' | 'listings' | null | undefined
  showTaxonomy?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showTaxonomy, title: titleFromProps } = props

  const { slug, categories, propertyTypes, meta, title, featuredImage } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const hasPropertyTypes = propertyTypes && Array.isArray(propertyTypes) && propertyTypes.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article className={cn('overflow-hidden', className)} ref={card.ref}>
      <div className="relative w-full ">
        {!featuredImage && !metaImage && <div className="">No image</div>}
        {featuredImage && typeof featuredImage !== 'string' && (
          <Media resource={featuredImage} size="360px" />
        )}
        {!featuredImage && metaImage && typeof metaImage !== 'string' && (
          <Media resource={metaImage} size="360px" />
        )}
      </div>
      <div className="p-4">
        {showTaxonomy && hasCategories && (
          <div className="uppercase text-sm mb-4">
            <div>
              {categories?.map((category, index) => {
                if (typeof category === 'object') {
                  const { title: titleFromCategory } = category

                  const categoryTitle = titleFromCategory || 'Untitled category'

                  const isLast = index === categories.length - 1

                  return (
                    <Fragment key={index}>
                      {categoryTitle}
                      {!isLast && <Fragment>, &nbsp;</Fragment>}
                    </Fragment>
                  )
                }

                return null
              })}
            </div>
          </div>
        )}
        {showTaxonomy && hasPropertyTypes && (
          <div className="uppercase text-sm mb-4">
            <div>
              {propertyTypes?.map((propertyType, index) => {
                if (typeof propertyType === 'object') {
                  const { title: titleFromType } = propertyType

                  const typeTitle = titleFromType || 'Untitled property type'

                  const isLast = index === propertyTypes.length - 1

                  return (
                    <Fragment key={index}>
                      {typeTitle}
                      {!isLast && <Fragment>, &nbsp;</Fragment>}
                    </Fragment>
                  )
                }

                return null
              })}
            </div>
          </div>
        )}
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link
                className="text-2xl text-brand-gray-06 font-bold no-underline"
                href={href}
                ref={link.ref}
              >
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
      </div>
    </article>
  )
}
