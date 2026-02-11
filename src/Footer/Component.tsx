import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import type { Footer } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faPinterestP,
  faXTwitter,
  faYoutube,
} from '@awesome.me/kit-a7a0dd333d/icons/classic/brands'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import Image from 'next/image'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { NewsletterForm } from './NewsletterForm'
import { Media as MediaType } from '@/payload-types'
import RichText from '@/components/RichText'

export async function Footer() {
  const footer: Footer = (await getCachedGlobal('footer', 1)()) as Footer
  const navMenus = footer?.navMenus
  const logos = footer?.middleRow?.logos
  const brokerageServicesHeading = footer?.middleRow?.brokerageServicesHeading
  const brokerageServicesText = footer?.middleRow?.brokerageServicesText
  const consumerProtectionHeading = footer?.middleRow?.consumerProtectionHeading
  const consumerProtectionText = footer?.middleRow?.consumerProtectionText
  const payload = await getPayload({ config: configPromise })
  // const footerNewsletterForm = await payload.findByID({
  //   collection: 'forms',
  //   id: '2',
  //   disableErrors: true
  // })
  return (
    <footer className="bg-brand-navy text-white px-[1.25rem] md:px-10 2xl:px-20 pt-20 pb-10">
      <div className=" pb-10 gap-x-8 gap-y-16 flex flex-col items-center md:items-start md:flex-row md:justify-between flex-wrap">
        {footer.logo && (
          <Link href="/">
            <Media resource={footer.logo} imgClassName="max-w-16" />
          </Link>
        )}

        <div className="max-w-5xl mx-auto flex flex-1 flex-col items-center justify-around md:flex-row gap-10 md:items-start">
          {navMenus &&
            navMenus.map((navMenu, index) => {
              const title = navMenu?.title
              const navItems = navMenu?.navItems
              if (!title || !navItems) return
              return (
                <div key={index} className="flex flex-col gap-4">
                  <span className="text-white text-base font-bold leading-none uppercase tracking-wider text-center md:text-left whitespace-nowrap">
                    {title}
                  </span>
                  <nav className="flex flex-col gap-2">
                    {navItems.map((navItem, index) => {
                      return (
                        <CMSLink
                          className="text-brand-gray-02 transition-colors hover:text-white focus-visible:text-white text-center md:text-left font-light"
                          key={index}
                          {...navItem.link}
                        />
                      )
                    })}
                  </nav>
                </div>
              )
            })}
        </div>
        {/* {footerNewsletterForm && (
          <div className="flex flex-col gap-6 md:max-w-fit lg:max-w-[21rem] md:mx-auto lg:m-0">
            <h2 className="font-bold text-2xl text-white text-center md:text-left">
              Get new properties sent straight to your inbox weekly!
            </h2>
            <div className="w-full h-[1px] bg-brand-gray-04/50"></div>
            <NewsletterForm form={footerNewsletterForm} />
          </div>
        )} */}
      </div>
      <div className="grid grid-cols-2 lg:flex justify-between items-center gap-10 lg:gap-20 xl:gap-40 py-10 border-t border-b border-brand-gray-04/50">
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-10 sm:gap-20 min-w-fit col-span-2">
          {logos && logos.length > 0 && logos.map(({ logo, id }) => {
            return <Media resource={logo as number | MediaType} key={id} className='flex items-center' imgClassName="w-full max-w-[10rem] max-h-[3rem] h-auto object-contain" />
          })

          }
          {/* <Image
            src="/api/media/file/kw_advantage_logo.svg"
            alt="KW Advantage logo"
            width={320}
            height={64}
            className="w-32 h-auto object-contain"
          />
          <Image
            src="/api/media/file/Frame.svg"
            alt="KW Advantage logo"
            width={320}
            height={64}
            className="w-40 h-auto object-contain"
          /> */}
        </div>
        <div className="mx-auto col-span-2 sm:col-span-1 lg:flex-1">
          <span className="block text-center sm:text-left mb-2 text-sm font-white font-bold leading-none uppercase tracking-wide">
            {brokerageServicesHeading ? brokerageServicesHeading : 'Brokerage Services'}
          </span>
          {brokerageServicesText && <RichText content={brokerageServicesText} className="text-sm text-center sm:text-left font-light leading-tight text-brand-gray-02 [&_a]:text-white [&_a]:underline" enableProse={false} enableGutter={false} />}
        </div>
        <div className=" mx-auto col-span-2 sm:col-span-1 lg:flex-1">
          <span className="block text-center sm:text-left mb-2 text-sm font-white font-bold leading-none uppercase tracking-wide">
            {consumerProtectionHeading ? consumerProtectionHeading : 'Consumer Protection'}
          </span>
          {consumerProtectionText && <RichText content={consumerProtectionText} className="text-sm text-center sm:text-left font-light leading-tight text-brand-gray-02 [&_a]:text-white [&_a]:underline" enableProse={false} enableGutter={false} />}
        </div>
      </div>
      <div className="w-full flex flex-col-reverse gap-10 md:flex-row justify-between items-center pt-10">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Onward Real Estate Team
        </p>
        <div className="flex gap-2">
          {footer.socials &&
            footer.socials.map((social, index) => {
              if (!social) return null
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
                  icon = faLinkedinIn
                  break
                case 'pinterest':
                  icon = faPinterestP
                  break
                default:
                  icon = undefined
              }
              return (
                <Link
                  key={social.id}
                  href={social.url || '/'}
                  target="_blank"
                  className="w-8 h-8 p-2 rounded-full bg-[rgba(148,148,148,0.25)] flex justify-center items-center"
                >
                  {icon && <FontAwesomeIcon icon={icon} className="w-full text-brand-gray-02" />}
                </Link>
              )
            })}
        </div>
      </div>
    </footer>
  )
}
