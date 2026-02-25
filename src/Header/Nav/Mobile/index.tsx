'use client'
import React, { useEffect, useState } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faChevronDown,
  faChevronUp,
  faXmark,
} from '@awesome.me/kit-a7a0dd333d/icons/sharp/regular'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'

export const HeaderMobileNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const navItems = header?.navItems || []
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { headerTheme } = useHeaderTheme()
  const { scrollY } = useScroll()
  const pathname = usePathname()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 1) setIsScrolled(true)
    else setIsScrolled(false)
  })

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="flex justify-end items-center" tabIndex={0}>
        <FontAwesomeIcon
          icon={faBars}
          className={`w-6 h-auto transition-colors duration-200 ${isScrolled || headerTheme === 'filled' ? 'text-brand-tan' : 'text-white'}`}
        />
      </SheetTrigger>
      <SheetContent className="p-[1.25rem] sm:p-8 bg-white border-none w-96 max-w-full">
        <SheetHeader className="sr-only">
          <SheetTitle>Mobile Menu</SheetTitle>
        </SheetHeader>
        <nav className="w-full justify-stretch" aria-label="Mobile Navigation">
          <ul className="flex-col items-start mt-16 space-x-0 gap-2 w-full">
            <Accordion type="single" collapsible className="w-full">
              {navItems.map(({ navItem }, i) => {
                if (navItem?.type === 'link') {
                  return (
                    <li key={i} className="[&:not(:last-child)]:border-b border-brand-gray-01">
                      <CMSLink
                        key={i}
                        {...navItem.link}
                        appearance="link"
                        className="w-full text-lg text-black py-4 uppercase hover:no-underline focus-visible:no-underline font-bold tracking-wider focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                      />
                    </li>
                  )
                }
                return (
                  <li key={i} className="[&:not(:last-child)]:border-b border-brand-gray-01">
                    <AccordionItem
                      value={navItem?.label || `item-${i}`}
                      className="border-none w-full"
                    >
                      <AccordionTrigger
                        className="py-4 w-full text-lg text-black hover:no-underline focus-visible:no-underline font-bold tracking-wider uppercase [&_svg]:text-brand-navy [&_svg]:w-4 focus-visible:ring-black rounded-none"
                        openIcon={faChevronUp}
                        closedIcon={faChevronDown}
                      >
                        {navItem?.label}
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-2 px-4">
                        {navItem?.enableParentLink && navItem.parentLink && (
                          <CMSLink
                            {...navItem.parentLink}
                            label={navItem.parentLinkMobileLabel || navItem.label}
                            className="w-full text-brand-gray-06 uppercase tracking-wide font-bold py-1"
                          />
                        )}
                        {navItem?.childrenLinks?.map((childLink, i) => {
                          return (
                            <CMSLink
                              key={i}
                              {...childLink.link}
                              className="w-full text-brand-gray-06 uppercase tracking-wide font-bold py-1"
                            />
                            // <Link
                            //   key={i}
                            //   href={childLink.link.url || ''}
                            //   className="w-full text-brand-gray-06 uppercase tracking-wide font-bold py-1"
                            // >
                            //   {childLink.link.label}
                            // </Link>
                          )
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  </li>
                )
              })}
            </Accordion>
          </ul>
        </nav>
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-navy focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary z-20">
          <FontAwesomeIcon icon={faXmark} className="w-4 h-auto text-black" />
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}
