import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@awesome.me/kit-a7a0dd333d/icons/sharp/regular'
import Link from 'next/link'
import Image from 'next/image'
import { faEnvelope, faPhone } from '@awesome.me/kit-a7a0dd333d/icons/sharp-duotone/thin'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faFacebookF,
  faInstagram,
  faLinkedin,
  faXTwitter,
  faYoutube,
} from '@awesome.me/kit-a7a0dd333d/icons/classic/brands'
import RichText from '@/components/RichText'
import { PageClient } from './page.client'
import { TestimonialCarousel } from '@/components/TeamMembers/TestimonialCarousel'
import { Listing } from '@/payload-types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ListingCard } from '@/components/Listings/ListingCard'
import { FormBlock } from '@/blocks/Form/Component'
import { Metadata } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import { Media } from '@/components/Media'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const teamMembers = await payload.find({
    collection: 'team-members',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  const params = teamMembers.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })
  const teamMemberArr = await payload.find({
    collection: 'team-members',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
    limit: 1,
  })
  const teamMember = teamMemberArr.docs[0] || null
  if (!teamMember) {
    console.log('No Team Member found')
    return
  }
  const teamMemberContactForm = await payload.findByID({
    collection: 'forms',
    id: 4,
  })
  const relatedListings = teamMember.relatedListings?.docs
  return (
    <>
      <PageClient teamMember={teamMember} />
      <div>
        {/* HERO */}
        <div className="bg-brand-navy pt-0 py-20 sm:py-32">
          <div className="container px-0 sm:px-10 flex flex-col sm:flex-row gap-10 sm:gap-16 md:gap-24 lg:gap-32 relative">
            <Button
              variant={'link'}
              className="text-brand-navy sm:text-brand-gray-02 flex items-center gap-2 hover:no-underline focus-visible:no-underline absolute top-6 left-5 sm:-top-20 sm:left-10 sm:hover:text-white sm:focus-visible:text-white p-2 z-10 focus-visible:ring-brand-navy sm:focus-visible:ring-white"
              asChild
            >
              <Link href="/about/team">
                <FontAwesomeIcon icon={faChevronLeft} className="w-2 h-auto" /> Back To Our Team
              </Link>
            </Button>
            <div className="px-5 pb-10 pt-20 sm:p-6 sm:pt-6 bg-brand-blue flex flex-col gap-8 sm:gap-10 w-full sm:max-w-96 relative sm:sticky sm:top-24 h-fit">
              {/* <div className="relative pb-[115%] overflow-hidden w-full"> */}
              <Media
                resource={teamMember?.details?.featuredImage}
                priority
                size="(max-width: 767px) 100vw, (min-width: 768px) 33vw"
                className="relative pb-[115%] overflow-hidden w-full"
                fill
                imgClassName="absolute top-0 left-0 w-full h-full object-cover"
              />
              {/* </div> */}
              <div className="w-full flex flex-col gap-8 sm:gap-6">
                <div className="flex flex-col gap-4 sm:gap-6">
                  <div>
                    <h1 className="text-brand-navy text-[2rem] font-bold leading-tight inline">
                      {teamMember.title}
                    </h1>
                    {teamMember?.details?.designations && (
                      <span className="inline ml-2 text-brand-navy text-xs font-bold leading-none">
                        {teamMember?.details?.designations}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-base text-brand-navy font-bold leading-tight tracking-wider uppercase">
                      {teamMember?.details?.jobTitle}
                    </h2>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {teamMember?.details?.email && (
                    <Link
                      href={`mailto:${teamMember?.details?.email}`}
                      className="p-3 rounded-xl bg-white border border-brand-gray-01 flex flex-grow gap-2 items-center justify-center hover:bg-brand-gray-01 focus-visible:bg-brand-gray-01 transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="w-full max-w-4 h-auto text-brand-navy"
                      />
                      <span className="text-base text-brand-gray-06 font-light">Email</span>
                    </Link>
                  )}
                  {teamMember?.details?.phone && (
                    <Link
                      href={`tel:${teamMember?.details?.phone.replaceAll('-', '')}`}
                      className="p-3 rounded-xl bg-white border border-brand-gray-01 flex flex-grow gap-2 items-center justify-center hover:bg-brand-gray-01 focus-visible:bg-brand-gray-01 transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="w-full max-w-4 h-auto text-brand-navy"
                      />
                      <span className="text-base text-brand-gray-06 font-light">Phone</span>
                    </Link>
                  )}
                  {teamMember?.details?.socials &&
                    teamMember?.details?.socials.length > 0 &&
                    teamMember?.details?.socials.map((social) => {
                      let icon: IconDefinition | undefined = undefined
                      switch (social.platform) {
                        case 'facebook':
                          icon = faFacebookF
                          break
                        case 'twitter':
                          icon = faXTwitter
                          break
                        case 'instagram':
                          icon = faInstagram
                          break
                        case 'youtube':
                          icon = faYoutube
                          break
                        case 'linkedin':
                          icon = faLinkedin
                          break
                        default:
                          icon = undefined
                      }
                      if (!icon) return
                      return (
                        <Link
                          key={social.id}
                          href={social.url || ''}
                          target="_blank"
                          className="p-3 rounded-xl bg-white border border-brand-gray-01 flex flex-grow gap-2 items-center justify-center hover:bg-brand-gray-01 focus-visible:bg-brand-gray-01 transition-colors"
                        >
                          <FontAwesomeIcon
                            icon={icon}
                            className="w-full max-w-4 h-auto text-brand-navy"
                          />
                          <span className="text-base text-brand-gray-06 font-light">
                            {social?.platform?.at(0)?.toUpperCase()}
                            {social.platform?.slice(1)}
                          </span>
                        </Link>
                      )
                    })}
                </div>
                <div>
                  <Button asChild className="w-full">
                    <Link href="#contact-form">Contact Me</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full px-5 md:px-0">
              <div
                className={`py-16 flex flex-col gap-6 border-t border-brand-gray-04 ${!teamMember?.details?.notableTransactions && !teamMember?.details?.eductationAndCertifications && 'border-b'}`}
              >
                <h2 className="text-[2rem] text-brand-offWhite font-bold leading-tight">About</h2>
                <RichText
                  content={teamMember?.details?.bio || {}}
                  className="text-brand-offWhite max-w-none p-0 font-light"
                />
              </div>
              {teamMember?.details?.eductationAndCertifications && (
                <div
                  className={`py-16 flex flex-col gap-6 border-t border-brand-gray-04 ${!teamMember?.details?.notableTransactions && 'border-b'}`}
                >
                  <h2 className="text-[2rem] text-brand-offWhite font-bold leading-tight">
                    Education & Certifications
                  </h2>
                  <RichText
                    content={teamMember?.details?.eductationAndCertifications}
                    className="text-brand-offWhite max-w-none p-0 font-light"
                  />
                </div>
              )}
              {teamMember?.details?.notableTransactions && (
                <div className="py-16 flex flex-col gap-6 border-t border-b border-brand-gray-04">
                  <h2 className="text-[2rem] text-brand-offWhite font-bold leading-tight">
                    Notable Transactions
                  </h2>
                  <RichText
                    content={teamMember?.details?.notableTransactions}
                    className="text-brand-offWhite max-w-none p-0 font-light"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TESTIMONIALS  */}
        <div className="w-full">
          <h2 className="sr-only">Testimonials</h2>
          <TestimonialCarousel testimonials={teamMember?.details?.testimonials} />
        </div>

        {/* AGENT LISTINGS */}
        {relatedListings && relatedListings.length > 0 && (
          <div className="bg-white py-20">
            <div className="container flex flex-col gap-10 overflow-hidden">
              <div>
                <h2 className="text-brand-gray-06 font-bold">My Listings in Your Area</h2>
              </div>
              <Carousel className="relative">
                <CarouselContent showOverflow={true}>
                  {relatedListings.map((listing: Listing, index) => (
                    <CarouselItem
                      key={listing.id}
                      className="basis-full sm:basis-1/2 lg:basis-1/3 ml-2"
                    >
                      <ListingCard listing={listing} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="mt-10 pb-1 sm:pb-0 sm:mt-0 sm:absolute sm:bottom-[calc(100%+2.5rem)] sm:left-auto sm:right-0 sm:top-auto flex justify-end items-center gap-6 sm:gap-10 ">
                  <CarouselPrevious className="w-8 p-1 border-none text-brand-gray-02 static top-auto left-auto bottom-auto right-auto translate-x-0 translate-y-0 hover:bg-transparent focus-visible:bg-transparent hover:text-brand-gray-04 focus-visible:text-brand-gray-04 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gray-04 focus-visible:outline-offset-4" />
                  <CarouselNext className="w-8 p-1 border-none text-brand-gray-02 static top-auto left-auto bottom-auto right-auto translate-x-0 translate-y-0 hover:bg-transparent focus-visible:bg-transparent hover:text-brand-gray-04 focus-visible:text-brand-gray-04 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gray-04 focus-visible:outline-offset-4" />
                </div>
              </Carousel>
            </div>
          </div>
        )}

        {/* CONTACT FORM */}
        <div className="flex flex-col sm:flex-row scroll-my-28" id="contact-form">
          <div className="flex-1 relative aspect-square md:aspect-auto h-auto md:min-h-96 p-20 px-10 lg:px-20">
            <Image
              src="/api/media/file/Image%20(1).webp"
              alt="Image"
              fill
              className="w-full h-full object-cover"
            />
          </div>
          <div className="px-5 py-20 md:px-10 lg:px-20 flex-1 border-t-[10px] border-brand-blue bg-brand-offWhite relative flex flex-col gap-6">
            <img
              className="absolute w-full h-full top-0 left-0 object-cover z-0 pointer-events-none"
              alt=""
              src="/pattern-geometric-general.png"
            />
            <div className="flex flex-col gap-10 relative z-10">
              <div className="flex flex-col gap-4">
                <h2 className="text-brand-gray-06 font-bold">Contact Me</h2>
                <p className="text-brand-gray-04 font-light">
                  {teamMember?.details?.phone ? (
                    <>Call me at <Link
                      href={`tel:${teamMember?.details?.phone?.replaceAll('-', '')}`}
                      className="underline"
                    >
                      {teamMember?.details?.phone}
                    </Link> or fill </>
                  ) : (
                    'Fill '
                  )
                  }
                  out this form to get in touch!
                </p>
              </div>
              {/* @ts-ignore */}
              <FormBlock form={teamMemberContactForm} styles={{ global: {}, resp: {} }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'team-members',
    draft: false,
    limit: 1,
    overrideAccess: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const teamMember = result.docs?.[0] || null

  return generateMeta({ doc: teamMember })
}