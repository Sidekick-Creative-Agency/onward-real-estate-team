import { Category, Post } from '@/payload-types'
import { Media } from '../Media'

import React from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@awesome.me/kit-a7a0dd333d/icons/sharp/light'
import { BRAND_TEXT_COLOR_CLASSES } from '@/utilities/constants'

interface PostCardProps {
  post: Post
  buttonColor?: string | null | undefined
  enableExcerpt?: boolean | null | undefined
  enableDate?: boolean | null | undefined
  enableGutter?: boolean | null | undefined
  enableBanner?: boolean | null | undefined
}
export const PostCard: React.FC<PostCardProps> = ({
  post,
  enableExcerpt,
  enableDate,
  enableGutter,
  buttonColor,
  enableBanner
}) => {
  return (
    <Link href={`/posts/${post.slug}`} className="w-full relative flex flex-col pl-4">
      <Media
        resource={post.featuredImage || undefined}
        className="w-full relative pb-[80%] overflow-hidden"
        imgClassName="absolute top-0 left-0 object-cover w-full h-full"
        size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (min-width: 1025px) 33.3vw"
      />
      {enableBanner && post.category && (
        <div
          className={`absolute top-4 left-0 py-2 px-6 bg-brand-navy before:border-l-brand-navy before:content-[''] before:absolute before:top-full before:left-0 before:w-0 before:h-0 before:border-[.725rem] before:border-transparent  before:opacity-50 before:-rotate-45 before:origin-top-left`}
        >
          <span className="text-white text-sm font-bold tracking-wider leading-none uppercase">
            {(post.category as Category).title}
          </span>
        </div>
      )}
      <div className={`py-4 ${enableGutter ? 'px-4' : ''} flex flex-col gap-6`}>
        <div className="flex flex-col gap-4">
          {enableDate && (
            <span className="font-light text-brand-gray-03">
              {new Date(post.publishedAt || post.updatedAt || '').toLocaleDateString('en-US', {
                month: 'long',
                day: '2-digit',
                year: 'numeric',
              })}
            </span>
          )}
          <h3 className="text-xl text-brand-gray-06 font-bold">{post.title}</h3>
          {post.excerpt && enableExcerpt && (
            <p className="font-light text-base leading-normal text-brand-gray-06 text-ellipsis line-clamp-2 overflow-hidden">
              {post.excerpt}
            </p>
          )}
        </div>
        <Button
          variant={'link'}
          className={`no-underline hover:no-underline focus-visible:no-underline font-light ${BRAND_TEXT_COLOR_CLASSES[buttonColor || 'navy']} text-lg flex items-center gap-1 w-fit p-0`}
          tabIndex={-1}
        >
          <FontAwesomeIcon icon={faPlus} className="w-2 h-auto" /> Read More
        </Button>
      </div>
    </Link>
  )
}
