'use client'
import { Button, ButtonProps } from '../ui/button'
import { cn } from '@/utilities/cn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@awesome.me/kit-a7a0dd333d/icons/sharp/light'
import { useDebounce } from '@/utilities/useDebounce'
import { useEffect, useId, useRef, useState } from 'react'
import useWindowDimensions from '@/utilities/useWindowDimensions'

interface CopyButtonProps extends ButtonProps {
  value: string
  src?: string
}

export function CopyButton({ value, className, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false)
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [toolTipPosition, setTooltipPosition] = useState('center')
  const debouncedIsTooltipOpen = useDebounce(isTooltipOpen, 500)
  const id = useId()
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const { width } = useWindowDimensions()
  useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  useEffect(() => {
    if (tooltipRef.current && buttonRef.current && width) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const tooltipWidth = tooltipRef.current.offsetWidth
      if (width - (buttonRect.right + tooltipWidth / 2) < 0) {
        setTooltipPosition('left')
      } else if (buttonRect.left - tooltipWidth / 2 < 0) {
        setTooltipPosition('right')
      } else {
        setTooltipPosition('center')
      }
    }
  }, [tooltipRef, width])
  return (
    <div className="relative">
      <Button
        size="icon"
        className={cn(
          'relative z-10 h-12 w-12 text-black bg-white hover:bg-brand-gray-00 rounded-full border border-brand-gray-00 shadow-md p-2 [&_svg]:h-auto [&_svg]:w-4 focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2',
          className,
        )}
        onClick={() => {
          navigator.clipboard.writeText(value)
          setHasCopied(true)
        }}
        onMouseOver={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
        onFocus={() => setIsTooltipOpen(true)}
        onBlur={() => setIsTooltipOpen(false)}
        aria-describedby={`tooltip-${id}`}
        ref={buttonRef}
        {...props}
      >
        <span className="sr-only">Copy</span>
        {hasCopied ? (
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
        ) : (
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
        )}
      </Button>
      <div
        className={`absolute bottom-[calc(100%+.5rem)]  rounded-none font-light px-3 py-1.5 bg-white shadow-md border transition-all border-brand-gray-00 whitespace-nowrap ${toolTipPosition === 'center' ? 'left-1/2 -translate-x-1/2' : toolTipPosition === 'left' ? 'right-0' : 'left-0'} ${debouncedIsTooltipOpen && !hasCopied ? 'visible opacity-100 scale-100 translate-y-0' : 'invisible scale-95 translate-y-1 opacity-0'}`}
        role="tooltip"
        id={`tooltip-${id}`}
        ref={tooltipRef}
      >
        <span>Copy to clipboard</span>
      </div>
      <div
        className={`absolute bottom-[calc(100%+.5rem)] ${toolTipPosition === 'center' ? 'left-1/2 -translate-x-1/2' : toolTipPosition === 'left' ? 'right-0' : 'left-0'} rounded-none font-light px-3 py-1.5 bg-white shadow-md border transition-all border-brand-gray-00 whitespace-nowrap ${hasCopied ? 'visible opacity-100 scale-100 translate-y-0' : 'invisible scale-95 translate-y-1 opacity-0'}`}
      >
        Copied!
      </div>
    </div>
  )
}
