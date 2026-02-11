import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { ArchiveBlock } from '../../blocks/ArchiveBlock/config'
import { FormBlock } from '../../blocks/Form/config'
import { hero } from '@/heros/config'
import { slugField } from '@/fields/Slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { FAQBlock } from '@/blocks/FAQBlock/config'
import { ColumnsBlock } from '@/blocks/ColumnsBlock/config'
import { NumberCountersBlock } from '@/blocks/NumberCounterBlock/config'
import { ExpertiseBlock } from '@/blocks/ExpertiseBlock/config'
import { TimelineBlock } from '@/blocks/TimelineBlock/config'
import { ReviewsBlock } from '@/blocks/ReviewsBlock/config'
import { JobListingsBlock } from '@/blocks/JobListingsBlock/config'
import { SocialProofCarouselBlock } from '@/blocks/SocialProofCarouselBlock/config'
import { MediaCarouselBlock } from '@/blocks/MediaCarouselBlock/config'
import { CardGridBlock } from '@/blocks/CardGridBlock/config'
import { FeaturedListingsBlock } from '@/blocks/FeaturedListingsBlock/config'
import { SearchBarBlock } from '@/blocks/SearchBarBlock/config'
import { populateSlug } from '@/utilities/populateSlug'
export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
        })

        return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
      })

      return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${path}`
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                ArchiveBlock,
                FormBlock,
                ColumnsBlock,
                FAQBlock,
                NumberCountersBlock,
                ExpertiseBlock,
                TimelineBlock,
                ReviewsBlock,
                JobListingsBlock,
                SocialProofCarouselBlock,
                MediaCarouselBlock,
                CardGridBlock,
                FeaturedListingsBlock,
                SearchBarBlock,
              ],
              required: true,
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'url',
      label: 'URL',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            return data?.breadcrumbs[data?.breadcrumbs?.length - 1]?.url || ''
          },
        ],
      },
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [populateSlug, populatePublishedAt],
    afterChange: [revalidatePage],
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
