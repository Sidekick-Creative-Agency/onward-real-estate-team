import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import type { Attachment, Post, PropertyType, TeamMember } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { CopyButton } from '@/components/CopyButton'
import { FloorPlanIcon } from '@/app/(frontend)/listings/map/page.client'
import { faFarm, faFilePdf } from '@awesome.me/kit-a7a0dd333d/icons/sharp-duotone/thin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import RichText from '@/components/RichText'
import { TeamMemberCard } from '@/components/TeamMembers/TeamMemberCard'
import { formatPrice } from '@/utilities/formatPrice'
import { formatNumber } from '@/utilities/formatNumber'
import {
  faChevronSquareUp,
  faChevronSquareDown,
  faChevronDown,
  faChevronUp,
  faImage,
} from '@awesome.me/kit-a7a0dd333d/icons/sharp/light'
import { ListingMap } from '@/components/Map/Individual'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { ColumnsBlock } from '@/blocks/ColumnsBlock/Component'
import { BRAND_COLORS } from '@/utilities/constants'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { Media as MediaType } from '@/payload-types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ContactForm } from '@/components/Listings/ContactForm'
import { notFound, redirect } from 'next/navigation'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const listings = await payload.find({
    collection: 'listings',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  const params = listings.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Listing({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/listings/' + slug
  const listing = await queryListingBySlug({ slug })
  const payload = await getPayload({ config: configPromise })

  const generalContactForm = await payload.findByID({
    collection: 'forms',
    id: 1,
  })

  if (!listing) return <PayloadRedirects url={url} />
  // if (!listing) notFound()
  if (!listing) redirect('/listings')

  return (
    <article>
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />
      <div className="bg-white pt-10 pb-20">
        <div className="container flex flex-col gap-10">
          <h1 className="sr-only">{listing.title}</h1>
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div className="flex flex-col gap-2 md:gap-6">
              <div className="flex gap-4 text-base text-brand-gray-03 uppercase tracking-wider font-bold">
                <span>{listing.availability}</span>|
                <span>
                  {listing.propertyType &&
                    typeof listing.propertyType === 'object' &&
                    listing.propertyType.map((propertyType, index) => {
                      if (listing.propertyType) {
                        return index !== listing.propertyType.length - 1
                          ? `${(propertyType as PropertyType).title}, `
                          : (propertyType as PropertyType).title
                      }
                      return ''
                    })}
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-[2.5rem] font-bold text-brand-navy leading-tight whitespace-pre-wrap md:whitespace-nowrap hidden md:block">
                  {listing.streetAddress}
                </span>
                <span className="text-[2.5rem] font-bold text-brand-navy leading-tight md:hidden">
                  {listing.price ? formatPrice(listing.price) : 'Contact for price'}
                </span>
                {listing.availability && (
                  <div className="py-2 px-3 rounded-lg bg-brand-blue bg-opacity-50 hidden md:block">
                    <span className="text-xs font-bold text-brand-navy tracking-wider uppercase">
                      {listing.availability}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-lg font-light text-brand-gray-03 hidden md:inline-block">
                {listing.city}, {listing.state} {listing.zipCode}
              </span>
              <span className="text-lg font-light text-brand-gray-03 inline-block md:hidden">
                {listing.streetAddress}, {listing.city}, {listing.state} {listing.zipCode}
              </span>
            </div>
            <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-4">
              <span className="text-3xl md:text-[2.5rem] font-bold text-brand-navy hidden md:inline-block text-right">
                {listing.price ? formatPrice(listing.price) : 'Contact for price'}
              </span>

              {listing.availability && (
                <div className="py-2 px-3 rounded-lg bg-brand-blue bg-opacity-50 block md:hidden">
                  <span className="text-xs font-bold text-brand-navy tracking-wider uppercase">
                    {listing.availability}
                  </span>
                </div>
              )}
              <CopyButton
                value={`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${url}`}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 grid-rows-2 gap-4">
            <Media
              resource={listing.featuredImage}
              className="col-span-4 sm:col-span-3 row-span-1 sm:row-span-2 relative aspect-video"
              imgClassName="absolute top-0 left-0 w-full h-full object-cover"
            />
            {listing.imageGallery && listing.imageGallery[0] && listing.imageGallery[1] && (
              <>
                <Media
                  resource={listing?.imageGallery[0]?.image as MediaType | number | undefined}
                  className="col-span-2 sm:col-span-1 row-span-1 relative"
                  imgClassName="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="col-span-2 sm:col-span-1 row-span-1 relative">
                  <Media
                    resource={listing.imageGallery[1].image as MediaType | number | undefined}
                    className="w-full h-full relative"
                    imgClassName="absolute top-0 left-0 w-full h-full object-cover"
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size={'icon'}
                        className="absolute bottom-2 right-2 z-10 w-12 h-12 p-2 rounded-md border-none bg-white bg-opacity-50 hover:bg-white hover:bg-opacity-50 focus-visible:bg-white focus-visible:bg-opacity-50 backdrop-blur-sm"
                      >
                        <FontAwesomeIcon icon={faImage} className="w-full h-auto" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[80rem] max-w-[calc(100vw-2.5rem)] md:max-w-[calc(100vw-5rem)] p-0 bg-transparent rounded-lg">
                      <DialogTitle hidden>Image Gallery</DialogTitle>
                      <Carousel className="w-full rounded-lg overflow-hidden">
                        <CarouselContent className=" ml-0 rounded-lg">
                          <CarouselItem className="pl-0 basis-full">
                            <Media
                              resource={listing.featuredImage}
                              className="w-full rounded-lg overflow-hidden"
                              imgClassName="w-full object-cover"
                            />
                          </CarouselItem>
                          {listing.imageGallery.map((image, index) => {
                            return (
                              <CarouselItem key={image.id} className=" pl-0 basis-full rounded-lg">
                                <Media
                                  resource={image.image as MediaType | number | undefined}
                                  className="w-full overflow-hidden rounded-lg"
                                  imgClassName="w-full object-cover"
                                />
                              </CarouselItem>
                            )
                          })}
                        </CarouselContent>
                        <CarouselPrevious className="left-2 p-2 bg-brand-navy text-white border-none hover:bg-brand-navy hover:text-white hover:opacity-80 focus-visible:bg-brand-navy focus-visible:text-white focus-visible:opacity-80 rounded-sm" />
                        <CarouselNext className="right-2 p-2 bg-brand-navy text-white border-none hover:bg-brand-navy hover:text-white hover:opacity-80 focus-visible:bg-brand-navy focus-visible:text-white focus-visible:opacity-80 rounded-sm" />
                      </Carousel>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            )}
            {listing.imageGallery && listing.imageGallery[0] && !listing.imageGallery[1] && (
              <Media
                resource={listing.imageGallery[0].image as MediaType | number | undefined}
                className="col-span-1 row-span-2 relative"
                imgClassName="absolute top-0 left-0 w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
      <div className="bg-brand-offWhite py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="col-span-1 md:col-span-2 p-4 py-10 sm:p-10 bg-white border-t-[10px] border-brand-navy flex flex-col">
              <div className="pb-10 flex flex-col sm:flex-row gap-6 sm:gap-10 justify-between items-start sm:items-end border-b border-brand-gray-01">
                <div className="flex flex-col gap-2">
                  <h2 className="text-[2.5rem] font-bold text-brand-navy">
                    {listing.price ? formatPrice(listing.price) : 'Contact for price'}
                  </h2>
                  <span className="text-base font-light text-brand-gray-03">
                    {listing.streetAddress}, {listing.city}, {listing.state} {listing.zipCode}
                  </span>
                </div>
                <div className="flex gap-2 justify-end flex-wrap">
                  {listing.area && (
                    <div className="p-2 rounded-xl border border-brand-gray-01 flex gap-2 items-center">
                      <FloorPlanIcon className="w-6" />
                      <span className="text-base text-brand-gray-06 font-light">
                        {formatNumber(listing.area)} sqft
                      </span>
                    </div>
                  )}
                  {listing.acreage && (
                    <div className="p-2 rounded-xl border border-brand-gray-01 flex gap-2 items-center">
                      <FontAwesomeIcon icon={faFarm} className="w-6 text-brand-navy" />
                      <span className="text-base text-brand-gray-06 font-light fill-brand-navy">
                        {formatNumber(listing.acreage)} acres
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Accordion type="multiple" defaultValue={['Overview', 'Resources']}>
                <AccordionItem value="Overview">
                  <AccordionTrigger
                    className="text-2xl font-bold text-brand-navy hover:no-underline py-10"
                    iconClassName="border border-brand-gray-01 w-4 h-4 text-brand-navy fill-brand-navy p-1"
                    closedIcon={faChevronDown}
                    openIcon={faChevronUp}
                  >
                    Property Overview
                  </AccordionTrigger>

                  <AccordionContent className="pb-10">
                    <RichText
                      content={listing.description || {}}
                      className="p-0 text-brand-gray-04 max-w-none *:text-brand-gray-04 font-light [&>p>strong]:text-brand-gray-04"
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="Resources">
                  <AccordionTrigger
                    className="text-2xl font-bold text-brand-navy hover:no-underline py-10"
                    iconClassName="border border-brand-gray-01 w-4 h-4 text-brand-navy fill-brand-navy p-1"
                    closedIcon={faChevronDown}
                    openIcon={faChevronUp}
                  >
                    Resources
                  </AccordionTrigger>

                  <AccordionContent className="pb-10">
                    <div className="flex gap-10">
                      {listing.attachments &&
                        listing.attachments.map((attachment, index) => {
                          if (typeof attachment.attachment === 'object') {
                            return (
                              <a
                                key={attachment.id}
                                className="flex items-center gap-2"
                                href={(attachment.attachment as Attachment).url || ''}
                                target="_blank"
                              >
                                <FontAwesomeIcon
                                  icon={faFilePdf}
                                  className="w-6 h-auto text-brand-navy"
                                />
                                <span className="text-base font-bold text-brand-gray-04">
                                  {(attachment.attachment as Attachment).label}
                                </span>
                              </a>
                            )
                          }
                          return ''
                        })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="col-span-1 p-4 py-10 sm:p-10 bg-white border-t-[10px] border-brand-navy flex flex-col h-fit sticky top-24">
              <div className="pb-10 flex gap-10 justify-between items-end">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold text-brand-navy">Get in Touch</h2>
                </div>
              </div>
              <ContactForm listing={listing} />
            </div>
          </div>
        </div>
      </div>
      <ListingMap listing={listing} />
      <div className="bg-white py-20">
        <div className="container">
          <div className="flex flex-col gap-10">
            <ArchiveBlock
              heading="Similar Listings in Your Area"
              blockType="archiveBlock"
              relationTo={'listings'}
              propertyTypes={listing.propertyType}
            />
          </div>
        </div>
      </div>
      <ColumnsBlock
        blockType="columnsBlock"
        columns={[
          {
            type: 'media',
            media: listing.featuredImage,
            size: 'half',
          },
          {
            type: 'text',
            richText: {
              root: {
                type: '',
                direction: 'ltr',
                format: 'left',
                indent: 0,
                version: 2,

                children: [
                  {
                    type: 'heading',
                    tag: 'h2',
                    indent: 0,
                    format: '',
                    version: 1,
                    direction: 'ltr',
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Contact Us',
                        type: 'text',
                        version: 1,
                      },
                    ],
                  },
                  {
                    type: 'paragraph',
                    textFormat: 0,
                    indent: 0,
                    format: '',
                    version: 1,
                    direction: 'ltr',
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: 'color: #757575',
                        text: 'Get in touch today and let us help you find your perfect property!',
                        type: 'text',
                        version: 1,
                      },
                    ],
                  },
                  {
                    fields: {
                      blockName: 'formBlock',
                      blockType: 'formBlock',
                      form: generalContactForm,
                      styles: {
                        global: {},
                        resp: {},
                      },
                    },
                    type: 'block',
                    version: 2,
                  },
                ],
              },
            },
            size: 'half',
            styles: {
              enableTopBorder: true,
              borderColor: BRAND_COLORS.find((color) => color.label === 'blue')?.label,
            },
            backgroundColor: BRAND_COLORS.find((color) => color.label === 'offWhite')?.label,
            backgroundImage: {
              url: '/pattern-geometric-general.png',
              alt: '',
              width: 400,
              height: 400,
              id: -1,
              createdAt: '',
              updatedAt: '',
            },
          },
        ]}
        styles={{
          global: {
            width: 'full',
          },
          resp: {},
        }}
      />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const listing = await queryListingBySlug({ slug })

  return generateMeta({ doc: listing })
}

const queryListingBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'listings',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
