'use client'
import { cn } from 'src/utilities/cn'
import React from 'react'
import RichText from '@/components/RichText'
import defaultTheme from 'tailwindcss/defaultTheme'

import type { Media as MediaType, Page } from '@/payload-types'

import { CMSLink } from '../../../components/Link'
import { Media } from '@/components/Media'
import { brandBgColorClasses } from '@/utilities/constants'
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import useWindowDimensions from '@/utilities/useWindowDimensions'

export type CarouselBlockProps = {
  items: {
    icon: MediaType
    heading: string
    content: string
  }[]
  blockType: 'carousel'
}

export const CarouselLexicalBlock: React.FC<CarouselBlockProps> = ({ items }) => {
  const { width } = useWindowDimensions()

  return (
    <div className={`carousel-lexical-block`}>
      <Carousel opts={{ align: 'start', duration: 18 }} className="w-full">
        <CarouselContent>
          {items?.map((item, index) => {
            if (typeof item === 'object' && item !== null) {
              return (
                <CarouselItem key={index} className="basis-full">
                  <div className="p-4 flex flex-col gap-6 items-start">
                    <span className="font-basic-sans text-brand-tan text-2xl font-light pb-2 border-b-2 border-brand-tan leading-none">
                      {index < 9 ? `0${index + 1}` : index + 1}
                    </span>
                    <div className="flex items-center gap-4">
                      {item.icon && (
                        <Media
                          resource={item.icon}
                          className="w-16"
                          imgClassName="w-full h-full object-contain m-0"
                        />
                      )}
                      <h3 className="text-white">{item.heading}</h3>
                    </div>
                    <div>
                      <p className="m-0 text-brand-offWhite">{item.content}</p>
                    </div>
                  </div>
                </CarouselItem>
              )
            }

            return null
          })}
        </CarouselContent>
        {width && width > parseInt(defaultTheme.screens.sm) && (
          <>
            <CarouselPrevious
              className={`bg-transparent border-none text-brand-blue hover:bg-transparent focus-visible:bg-transparent hover:text-white focus-visible:text-white ${width && width < parseInt(defaultTheme.screens.lg) && '-left-8'}`}
            />
            <CarouselNext
              className={`bg-transparent border-none text-brand-blue hover:bg-transparent focus-visible:bg-transparent hover:text-white focus-visible:text-white ${width && width < parseInt(defaultTheme.screens.lg) && '-right-8'}`}
            />
          </>
        )}

        <CarouselDots
          className="flex gap-2"
          dotClassName="h-[2px] w-full bg-brand-tan rounded-none hover:bg-brand-tan focus-visible:bg-brand-tan"
        />
      </Carousel>
    </div>
  )
}
