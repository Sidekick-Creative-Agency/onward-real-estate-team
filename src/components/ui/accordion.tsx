'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from 'src/utilities/cn'
import { faMinus, faPlus } from '@awesome.me/kit-a7a0dd333d/icons/sharp/regular'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@awesome.me/kit-a7a0dd333d/icons'

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('border-b', className)} {...props} />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger> & {
    iconClassName?: string
  } & {
    closedIcon?: IconDefinition
  } & { openIcon?: IconDefinition },
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    iconClassName?: string
  } & {
    closedIcon?: IconDefinition
  } & { openIcon?: IconDefinition }
>(({ className, children, iconClassName, closedIcon, openIcon, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-6 font-medium transition-all hover:underline [&[data-state=open]>.open-icon]:hidden [&[data-state=open]>.close-icon]:block',
        className,
      )}
      {...props}
    >
      {children}
      <React.Fragment>
        <FontAwesomeIcon
          icon={closedIcon || faPlus}
          className={`${iconClassName ? iconClassName : 'w-6 h-6 text-brand-tan'} open-icon `}
        />
        <FontAwesomeIcon
          icon={openIcon || faMinus}
          className={`${iconClassName ? iconClassName : 'w-6 h-6 text-brand-tan'} close-icon hidden `}
        />
      </React.Fragment>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
