'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '../ui/button'
import { faChevronDown } from '@awesome.me/kit-a7a0dd333d/icons/sharp/regular'
import { createContext, useContext, useState } from 'react'
import { useDebounce } from '@/utilities/useDebounce'

import Link from 'next/link'
import { CMSLinkType } from '../Link'
import { Page } from '@/payload-types'

interface DropdownMenuProps {
  children: React.ReactNode
  className?: string
}

type DropdownMenuContextType = {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}
const DropdownMenuContext = createContext<DropdownMenuContextType>({
  isOpen: false,
  setIsOpen: () => { },
})

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const debouncedIsOpen = useDebounce(isOpen, 200)

  return (
    <DropdownMenuContext.Provider value={{ isOpen: debouncedIsOpen, setIsOpen }}>
      <div className={`relative ${className}`}>{children}</div>
    </DropdownMenuContext.Provider>
  )
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  className?: string
  asLink?: boolean | null | undefined
  link?: CMSLinkType | null | undefined
}
export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  className,
  asLink,
  link,
}) => {
  const context = useContext(DropdownMenuContext)

  if (asLink && link) {
    const href =
      link?.type === 'reference' && typeof link.reference?.value === 'object'
        ? link.reference?.relationTo === 'pages'
          ? `${(link.reference?.value as Page)?.url}`
          : `${link.reference?.relationTo}/${link.reference.value.slug}`
        : link.url

    if (!href) return null

    const newTabProps = link.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}
    return (
      <Link
        className={`bg-transparent p-2 uppercase flex gap-2 rounded-none border-none font-bold text-base tracking-[1.6px] hover:bg-transparent focus-visible:bg-transparent data-[state=open]:bg-transparent focus-visible:outline-none transition ${className}`}
        href={href}
        {...newTabProps}
        onMouseEnter={() => context.setIsOpen(true)}
        onMouseLeave={() => context.setIsOpen(false)}
        onFocus={() => context.setIsOpen(true)}
        onBlur={() => context.setIsOpen(false)}
        aria-expanded={context.isOpen}
      >
        {link.label}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`w-2 h-auto transition-transform ${context.isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </Link>
    )
  }

  return (
    <Button
      className={`bg-transparent p-2 uppercase flex gap-2 rounded-none border-none font-bold text-base tracking-[1.6px] hover:bg-transparent focus-visible:bg-transparent data-[state=open]:bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-2 transition ${className}`}
      onMouseEnter={() => context.setIsOpen(true)}
      onMouseLeave={() => context.setIsOpen(false)}
      onFocus={() => context.setIsOpen(true)}
      onBlur={() => context.setIsOpen(false)}
      aria-expanded={context.isOpen}
    >
      {children}
      <FontAwesomeIcon
        icon={faChevronDown}
        className={`w-2 h-auto transition-transform ${context.isOpen ? 'rotate-180' : 'rotate-0'}`}
      />
    </Button>
  )
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  className?: string
}
export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  className,
  children,
}) => {
  const context = useContext(DropdownMenuContext)
  return (
    <div
      className={`absolute top-full z-10 w-auto min-w-full p-2 rounded-sm bg-white shadow-[0_0px_10px_rgba(0,0,0,0.1)] transition-all delay-0 ${context.isOpen ? 'visible scale-100' : 'invisible scale-95'} ${className}`}
      onMouseEnter={() => context.setIsOpen(true)}
      onMouseLeave={() => context.setIsOpen(false)}
      onFocus={() => context.setIsOpen(true)}
      onBlur={() => context.setIsOpen(false)}
    >
      {children}
    </div>
  )
}
