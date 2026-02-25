'use client'
import type { StaticImageData } from 'next/image'
import { cn } from 'src/utilities/cn'
import NextImage from 'next/image'
import React, { useEffect, useState } from 'react'
import type { Props as MediaProps } from '../types'
import cssVariables from '@/cssVariables'
import { Skeleton } from '@/components/ui/skeleton'

const { breakpoints } = cssVariables

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    quality = 80,
  } = props

  const [isLoading, setIsLoading] = useState(true)
  const [width, setWidth] = useState<number | undefined>(undefined)
  const [height, setHeight] = useState<number | undefined>(undefined)
  const [alt, setAlt] = useState<string | undefined>(altFromProps || '')
  const [src, setSrc] = useState<StaticImageData | string>(srcFromProps || '')
  const [blurhash, setBlurhash] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!src && resource && typeof resource === 'number') {
      fetch(`/api/media/${resource}`).then((response) =>
        response.json().then((json) => {
          const {
            alt: altFromResource,
            height: fullHeight,
            url,
            width: fullWidth,
            blurhash,
          } = json

          setWidth(fullWidth!)
          setHeight(fullHeight!)
          setAlt(altFromResource || '')
          setSrc(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${url}`)
          setBlurhash(blurhash || undefined)
        }),
      )
    } else if (!src && resource && typeof resource === 'object') {
      const {
        alt: altFromResource,
        height: fullHeight,
        url,
        width: fullWidth,
        blurhash,
      } = resource

      setWidth(fullWidth!)
      setHeight(fullHeight!)
      setAlt(altFromResource || '')
      setSrc(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${url}`)
      setBlurhash(blurhash || undefined)
    }
  }, [resource])

  useEffect(() => {
    if (src) {
      setIsLoading(false)
    }
  }, [src])

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
      .map(([, value]) => `(max-width: ${value}px) ${value}px`)
      .join(', ')

  if (!src) return <Skeleton className="w-full h-full rounded-none" />

  return (
    <NextImage
      alt={alt || ''}
      className={cn(imgClassName)}
      fill={fill}
      height={!fill ? height : undefined}
      onClick={onClick}
      onLoad={() => {
        setIsLoading(false)
        if (typeof onLoadFromProps === 'function') {
          onLoadFromProps()
        }
      }}
      priority={priority}
      quality={quality}
      sizes={sizes}
      src={src}
      width={!fill ? width : undefined}
      placeholder={blurhash ? 'blur' : 'empty'}
      blurDataURL={blurhash || undefined}
      style={{
        objectPosition:
          typeof resource === 'object' && resource.focalX && resource.focalY
            ? `${resource.focalX}% ${resource.focalY}%`
            : 'center',
      }}
    />
  )
}
