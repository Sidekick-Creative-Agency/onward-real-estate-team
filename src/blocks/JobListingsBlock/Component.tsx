import React from 'react'
import type { Page } from '@/payload-types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import defaultTheme from 'tailwindcss/defaultTheme'
import RichText from '@/components/RichText'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

type Props = Extract<Page['layout'][0], { blockType: 'jobListingsBlock' }>

export const JobListingsBlock: React.FC<
  {
    id?: string
  } & Props
> = async (props) => {
  const { id, heading, subtitle } = props
  const payload = await getPayload({ config: configPromise })
  const jobListingsDocs = await payload.find({
    collection: 'job-listings',
    where: {
      active: {
        equals: true,
      },
    },
  })
  const jobListings = jobListingsDocs.docs

  return (
    <>
      <div className={`job-listings-block-${id} flex flex-col items-stretch bg-brand-tan`}>
        <div className="container py-20 sm:py-32 flex flex-col gap-10 sm:gap-20">
          {(heading || subtitle) && (
            <div className="flex flex-col gap-4 items-center">
              {heading && (
                <h2 className="text-center text-[2.5rem] text-white font-medium">{heading}</h2>
              )}
              {subtitle && (
                <RichText
                  content={subtitle}
                  enableProse={false}
                  className="text-center text-base sm:text-lg text-white font-normal [&_a]:underline"
                />
              )}
            </div>
          )}
          <div className="px-6 py-10 sm:px-16 sm:py-20 bg-white shadow-lg">
            <Accordion type="single" collapsible className="w-full mx-auto">
              {jobListings &&
                jobListings.length > 0 &&
                jobListings.map((jobListing, index) => {
                  const { title, description } = jobListing
                  return (
                    <AccordionItem key={index} value={title}>
                      {title && (
                        <AccordionTrigger className="text-xl sm:text-2xl text-brand-navy font-bold text-start gap-4">
                          {title}
                        </AccordionTrigger>
                      )}
                      {description && (
                        <AccordionContent>
                          <RichText
                            content={description}
                            enableGutter={false}
                            className="text-base font-light text-brand-gray-04"
                          />
                        </AccordionContent>
                      )}
                    </AccordionItem>
                  )
                })}
            </Accordion>
          </div>
        </div>
      </div>
    </>
  )
}