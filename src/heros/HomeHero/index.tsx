'use client'
import React, { useState } from 'react'
import type { Page } from '@/payload-types'
import { Media } from '@/components/Media'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronRight,
  faCircleNotch,
  faMagnifyingGlass,
} from '@awesome.me/kit-a7a0dd333d/icons/sharp/regular'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'

const SearchFormSchema = z.object({
  search: z.string().min(1, { message: 'This field is required' }),
})

export const HomeHero: React.FC<Page['hero'] & { title: string }> = ({
  media,
  enableOverrideTitle,
  overrideTitle,
  title,
  heroLogos,
  homeHeroLinks,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof SearchFormSchema>>({
    resolver: zodResolver(SearchFormSchema),
  })
  const router = useRouter()
  const onSubmit = (data: z.infer<typeof SearchFormSchema>) => {
    try {
      setIsLoading(true)
      router.push(`/listings/map?search=${data.search}`)
    } catch (error) {
      console.error('Error submitting form:', error)
      setIsLoading(false)
    }
  }
  return (
    <div className="relative flex flex-col items-center -mt-[125px] pt-40 pb-0 md:pt-48 md:pb-20 min-h-[25rem] md:min-h-[35rem] 2xl:min-h-[50rem]">
      <div className="container max-w-5xl z-10 relative flex flex-col items-center justify-center gap-16 pb-20 min-[888px]:pb-0">
        <h1 className="text-white text-center text-[2.5rem] sm:text-5xl md:text-[4rem] leading-tight sm:leading-tight font-bold">
          {enableOverrideTitle ? overrideTitle : title}
        </h1>
        <div className="relative p-2 pl-4 md:p-4 md:pl-8 bg-white/35 backdrop-blur-[12.5px] w-full">
          <form className="flex gap-4 sm:gap-10 w-full" onSubmit={form.handleSubmit(onSubmit)}>
            <Input
              className="bg-transparent h-auto px-0 border-none text-base md:text-xl text-white font-light leading-none w-full placeholder:text-white focus-visible:ring-transparent focus-visible:ring-offset-transparent"
              type="text"
              placeholder="Search by Neighborhood, City, Zipcode..."
              {...form.register('search')}
            />
            <Button className="flex gap-2 items-center p-3 md:px-8 md:py-4" type="submit">
              {!isLoading && <FontAwesomeIcon icon={faMagnifyingGlass} />}
              {isLoading && <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />}
              <span className="hidden md:inline">Property Search</span>
            </Button>
          </form>
          {form.formState.errors.search && (
            <span className="absolute bottom-[calc(100%+.5rem)] left-1/2 -translate-x-1/2 text-brand-navy text-center px-4 py-2 bg-white before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-0 before:border-8 before:border-transparent before:border-t-white">
              {form.formState.errors.search.message}
            </span>
          )}
        </div>
        {heroLogos && (
          <div className="flex flex-wrap gap-y-8 gap-x-20 justify-center items-center">
            {heroLogos.map((logo, index) => {
              return <Media key={index} resource={logo.logo || ''} className="h-auto" imgClassName='w-full max-w-[12rem] h-auto max-h-[4rem]' priority />
            })}
          </div>
        )}
      </div>
      {homeHeroLinks && (
        <div className="container p-0 min-[888px]:px-10 min-[888px]:pt-40 relative z-10 flex flex-wrap flex-col min-[888px]:flex-row gap-0 min-[888px]:gap-6 justify-between items-center w-full bg-white min-[888px]:bg-transparent">
          {homeHeroLinks.map((link, index) => {
            const href =
              link.link.type === 'reference' && typeof link.link.reference?.value === 'object'
                ? link.link.reference?.relationTo === 'pages'
                  ? `${(link.link.reference?.value as Page)?.url}`
                  : `${link.link.reference?.relationTo}/${link.link.reference.value.slug}`
                : link.link.url

            if (!href) return null

            const newTabProps = link.link.newTab
              ? { rel: 'noopener noreferrer', target: '_blank' }
              : {}
            return (
              <Button
                key={index}
                className="bg-transparent w-full p-10 min-[888px]:p-4 min-[888px]:w-auto flex flex-col gap-2 items-start border-0 border-b border-brand-gray-01 min-[888px]:border-white hover:bg-transparent focus-visible:bg-transparent group text-brand-navy min-[888px]:text-white "
                asChild
              >
                <Link href={href} {...newTabProps}>
                  <span className="text-[.625rem] font-light tracking-wider uppercase">
                    {link.beforeLabelText}
                  </span>
                  <div className="flex items-center gap-4 font-bold w-full justify-between">
                    <span>{link.link.label}</span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-3 min-[888px]:w-2 h-auto ml-0 transition-transform group-hover:translate-x-2 "
                    />
                  </div>
                </Link>
              </Button>
            )
          })}
        </div>
      )}
      {media && typeof media === 'object' && (
        <div className="absolute top-0 left-0 w-full h-3/4 min-[888px]:h-full">
          <Image
            src={media.url || ''}
            alt={media.alt || ''}
            fill
            className="object-cover -z-10"
            priority
          />
          <div className="absolute pointer-events-none left-0 bottom-0 w-full h-full bg-brand-navy/85  mix-blend-multiply z-0" />
        </div>
      )}
    </div>
  )
}
