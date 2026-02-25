'use client'

import React from 'react'

import type { Header } from '@/payload-types'

import { NavMenu } from '../NavMenu'

export const RightHeaderNav: React.FC<{ navItems: Header['navItems']; isScrolled: boolean }> = ({
  navItems,
  isScrolled,
}) => {
  return (
    <div className="flex items-center justify-center">
      <NavMenu navItems={navItems} isScrolled={isScrolled} label='Right Desktop Navigation' />
    </div>
  )
}
