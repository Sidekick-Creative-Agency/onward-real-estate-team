import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import {
  lexicalEditor,
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  LinkFeature,
} from '@payloadcms/richtext-lexical'
import { TextColorFeature } from '@/components/RichText/Color/features/textColor/feature.server'
import { revalidateCareersPage } from './hooks/revalidateCareersPage'
import { BRAND_COLORS } from '@/utilities/constants'

export const JobListings: CollectionConfig = {
  slug: 'job-listings',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
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
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            OrderedListFeature(),
            UnorderedListFeature(),
            LinkFeature(),
            TextColorFeature({
              colors: BRAND_COLORS.map((color) => {
                return {
                  type: 'button',
                  label: color.label,
                  color: color.value,
                }
              }),
            }),
          ]
        },
      }),
      required: true,
    },
    // {
    //   name: 'active',
    //   type: 'checkbox',
    //   admin: {
    //     description:
    //       'If unchecked, this Job Listing will not show up on the front end of the website.',
    //   },
    // },
  ],
  hooks: {
    afterChange: [revalidateCareersPage],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
}
