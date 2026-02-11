import type { CollectionBeforeChangeHook } from 'payload'

import { formatSlug } from '@/fields/Slug/formatSlug'
import { Post, Listing, Page, TeamMember } from '@/payload-types'

export const populateSlug: CollectionBeforeChangeHook<Post | Page | Listing | TeamMember> = ({
  data,
}) => {
  if (!data.slugLock) return data
  if (!data.title) {
    data.slug = ''
    return data
  }

  const formattedSlug = formatSlug(data.title)
  if (data.slug !== formattedSlug) {
    data.slug = formattedSlug
  }
  return data
}
