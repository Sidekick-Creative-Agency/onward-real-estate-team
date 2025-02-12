import { Category, Media as MediaType, Post } from '@/payload-types'
import { Media } from '../Media'

import React from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@awesome.me/kit-a7a0dd333d/icons/sharp/light'

interface PostCardProps {
  post: Post
}
export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Link href={`/posts/${post.slug}`} className="w-full relative flex flex-col">
      <Media
        resource={post.featuredImage || undefined}
        className="w-full relative pb-[80%] overflow-hidden"
        imgClassName="absolute top-0 left-0 object-cover w-full h-full"
      />
      {post.category && (
        <div
          className={`absolute top-4 -left-4 py-2 px-6 bg-brand-navy before:border-l-brand-navy before:content-[''] before:absolute before:top-full before:left-0 before:w-0 before:h-0 before:border-[.725rem] before:border-transparent  before:opacity-50 before:-rotate-45 before:origin-top-left`}
        >
          <span className="text-white text-sm font-bold tracking-wider leading-none uppercase">
            {(post.category as Category).title}
          </span>
        </div>
      )}
      <div className="p-4 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl text-brand-gray-06 font-bold">{post.title}</h3>
          <p className="font-light text-xl leading-normal text-brand-gray-06 text-ellipsis line-clamp-2 overflow-hidden">
            {post.excerpt}
          </p>
        </div>
        <Button
          variant={'link'}
          className="no-underline hover:no-underline focus-visible:no-underline font-light text-brand-navy text-lg flex items-center gap-2 w-fit p-0"
          tabIndex={-1}
        >
          <FontAwesomeIcon icon={faPlus} className="w-3 h-auto" /> Read More
        </Button>
      </div>
    </Link>
  )
}
