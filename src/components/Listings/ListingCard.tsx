'use client'
import { Listing } from '@/payload-types'
import React, { useEffect, useRef } from 'react'
import { Media } from '../Media'
import Link from 'next/link'
import { formatPrice } from '../../utilities/formatPrice'
import { useAnimate, useInView } from 'framer-motion'

interface ListingCardProps {
  listing: Listing
}
export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true, amount: 'some', margin: '-128px -16px -16px -16px' })

  useEffect(() => {
    if (isInView) {
      animate(scope.current?.querySelector('h3'), { opacity: [0, 1], y: [20, 0] })
      scope.current?.querySelectorAll('span').forEach((span, index) => {
        setTimeout(() => {
          animate(span, { opacity: 1, y: 0 })
        }, 25 * (index + 1))
      })

    } else {
      animate(scope.current?.querySelectorAll('h3'), { opacity: 0, y: 20 })
      animate(scope.current?.querySelectorAll('span'), { opacity: 0, y: 20 })
    }
  }, [isInView])
  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="w-full relative p-8 pl-12 flex items-end min-h-[20rem] md:min-h-[25rem] h-full "
      ref={scope}
    >
      <Media
        resource={listing.featuredImage}
        className="absolute top-0 left-4 w-[calc(100%-1rem)] h-full overflow-hidden z-0"
        imgClassName="object-cover w-full h-full relative"
        size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (min-width: 1025px) 33.3vw"
      />
      <div className="absolute top-0 left-4 w-[calc(100%-1rem)] h-full bg-gradient-to-t from-black to-transparent via-transparent z-10"></div>
      {listing.category && (
        <div
          className={`absolute top-4 left-0 py-2 px-6 ${listing.category === 'commercial' ? 'bg-brand-brown before:border-l-brand-brown' : 'bg-brand-blue before:border-l-brand-blue'} before:content-[''] before:absolute before:top-full before:left-0 before:w-0 before:h-0 before:border-[.725rem] before:border-transparent  before:opacity-50 before:-rotate-45 before:origin-top-left`}
        >
          <span className="text-white text-sm font-bold tracking-wider leading-none uppercase"
          >
            {listing.category}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2 w-full relative z-10">
        <h3
          className="text-white text-2xl font-bold uppercase tracking-wider leading-tight translate-y-[20px] opacity-0"

        >
          {listing.city}, {listing.state}
        </h3>
        <span
          className="text-white uppercase text-sm font-bold tracking-wider leading-tight translate-y-[20px] opacity-0"

        >
          {listing.streetAddress}
        </span>
        {typeof listing.price === 'number' && listing.price !== 0 && !listing.priceLabel ? (
          <span
            className="text-xl font-light text-white leading-tight translate-y-[20px] opacity-0"

          >
            {formatPrice(listing.price)}{' '}
            {listing.textAfterPrice && <span className="text-sm">{listing.textAfterPrice}</span>}
          </span>
        ) : (
          <span
            className="text-xl font-light text-white translate-y-[20px] opacity-0"

          >
            {listing.priceLabel || 'Contact for price'}
          </span>
        )}
      </div>
    </Link>
  )
}
