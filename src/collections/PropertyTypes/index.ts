import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '@/access/anyone'

export const PropertyTypes: CollectionConfig = {
  slug: 'property-types',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'relatedListings',
      type: 'join',
      collection: 'listings',
      on: 'propertyType',
    },
  ],
}
