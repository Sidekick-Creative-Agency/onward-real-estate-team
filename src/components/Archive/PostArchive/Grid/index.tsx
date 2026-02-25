'use client'
import React, { useEffect, useState } from 'react'

import { DataFromCollectionSlug, Where } from 'payload'
import { PostCard } from '@/components/Posts/PostCard'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@awesome.me/kit-a7a0dd333d/icons/sharp/regular'
import { Category } from '@/payload-types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { stringify } from 'qs-esm'

interface PostArchiveGridProps {
  data: DataFromCollectionSlug<'posts'>[]
  limit?: number
  hasNextPage?: boolean
  buttonColor?: string | null | undefined
  enableFilter?: boolean | null | undefined
  enableExcerpt?: boolean | null | undefined
  enableDate?: boolean | null | undefined
  enableGutter?: boolean | null | undefined
  enableBanner?: boolean | null | undefined
}

export const PostArchiveGrid: React.FC<PostArchiveGridProps> = ({
  data,
  limit,
  hasNextPage: _hasNextPage,
  enableFilter,
  enableExcerpt,
  enableDate,
  enableGutter,
  buttonColor,
  enableBanner
}) => {
  const [posts, setPosts] = useState(data)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(_hasNextPage)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[] | undefined>(undefined)
  const [activeCategory, setActiveCategory] = useState<Category | undefined>(undefined)

  const fetchMorePosts = async () => {
    setIsLoading(true)
    if (!hasNextPage) return
    try {
      const query: Where = {
        and: [
          activeCategory?.title ? {
            'category.title': {
              equals: activeCategory?.title
            }
          } : {},
          {
            _status: {
              equals: 'published'
            }
          }
        ]
      }
      const stringifiedQuery = stringify(
        {
          limit: limit,
          page: currentPage + 1,
          where: query,
        },
        { addQueryPrefix: true },
      )
      const response = await fetch(
        `/api/posts${stringifiedQuery}&sort=-publishedAt,-updatedAt`,
      )
      if (response.ok) {
        const newData = await response.json()
        const newDocs = newData.docs
        const hasNextPage = newData.hasNextPage
        setPosts((prevPosts) => [...prevPosts, ...newDocs])
        if (hasNextPage) {
          setCurrentPage((current) => current + 1)
        }
        setHasNextPage(hasNextPage)
      }
    } catch (error: any) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterPosts = async (categoryTitle: string) => {
    setIsLoading(true)
    const category = categories?.find((category) => category.title === categoryTitle)
    setActiveCategory(category)
    setPosts([])
    try {
      const query: Where = {
        and: [
          category?.title ? {
            'category.title': {
              equals: category?.title
            }
          } : {},
          {
            _status: {
              equals: 'published'
            }
          }
        ]
      }
      const stringifiedQuery = stringify(
        {
          limit: limit,
          where: query,
        },
        { addQueryPrefix: true },
      )
      const response = await fetch(
        `/api/posts${stringifiedQuery}&sort=-publishedAt,-updatedAt`,
      )
      if (response.ok) {
        const newData = await response.json()
        const newDocs = newData.docs
        const hasNextPage = newData.hasNextPage
        setPosts(newDocs)
        setCurrentPage(1)
        setHasNextPage(hasNextPage)
      }
    } catch (error: any) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    const fetchedCategories = await fetch('/api/categories?sort=title')
    if (fetchedCategories.ok) {
      const fetchedCategoriesJson = await fetchedCategories.json()
      setCategories(fetchedCategoriesJson.docs)
    } else {
      console.error('Error fetching categories')
    }
  }

  useEffect(() => {
    if (enableFilter) {
      fetchCategories()
    }
  }, [])
  return (
    <div className="relative w-full flex flex-col gap-10 items-center">
      {enableFilter && (
        <Select onValueChange={(value) => filterPosts(value)} value={activeCategory?.title || ''}>
          <SelectTrigger className="text-base font-light rounded-none mr-auto w-full sm:w-fit sm:min-w-64 md:min-w-[calc(33.33%-1rem)] md:max-w-[calc(33.33%-1rem)] md:absolute md:bottom-[calc(100%+5rem)] md:right-0 lg:min-w-64">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white rounded-none">
            <SelectItem
              value="all"
              className="rounded-none text-base font-light hover:bg-brand-blue/50"
            >
              All
            </SelectItem>
            {categories &&
              categories.map((category) => {
                return (
                  <SelectItem
                    key={category.id}
                    value={category.title}
                    className="rounded-none text-base font-light hover:bg-brand-blue/50"
                  >
                    {category.title}
                  </SelectItem>
                )
              })}
          </SelectContent>
        </Select>
      )}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts &&
          posts.length > 0 &&
          posts?.map((post, index) => {
            if (typeof post === 'object' && post !== null) {
              return (
                <div key={index} className="w-full">
                  <div className={`w-full duration-1000`}>
                    <PostCard
                      post={post}
                      buttonColor={buttonColor}
                      enableExcerpt={enableExcerpt}
                      enableDate={enableDate}
                      enableGutter={enableGutter}
                      enableBanner={enableBanner}
                    />
                  </div>
                </div>
              )
            }
            return null
          })}
        {isLoading &&
          (!posts || posts.length === 0) &&
          Array.from(Array(3).keys())

            .map((_, index) => {
              return (
                <div key={index} className="w-full">
                  <div className="relative w-full pb-[80%] rounded-none overflow-hidden">
                    <Skeleton className="w-full h-full absolute top-0 left-0 rounded-none" />
                  </div>
                  <div className="p-4 flex flex-col gap-10">
                    <Skeleton className="w-full h-12" />
                    <Skeleton className="w-1/2 h-8" />
                  </div>
                </div>
              )
            })}
        {!isLoading && (!posts || posts.length === 0) && (
          <div className="col-span-full">
            <p className="text-lg text-center">No posts found</p>
          </div>
        )}
      </div>
      {hasNextPage && (
        <Button onClick={fetchMorePosts} className="w-fit min-w-44">
          {isLoading ? (
            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
          ) : (
            'Load more'
          )}
        </Button>
      )}
    </div>
  )
}
