import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'

import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'

import { revalidateListing } from './hooks/revalidateListing'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/Slug'
import { anyone } from '@/access/anyone'
import { deleteRelatedMedia } from './hooks/deleteRelatedMedia'
import { validateListingSlug } from './hooks/validateListingSlug'

export const Listings: CollectionConfig = {
  slug: 'listings',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    listSearchableFields: ['title', 'slug', 'streetAddress', 'city', 'state', 'zipCode'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'listings',
        })

        return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'listings',
      })

      return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${path}`
    },
    components: {
      beforeList: ['/components/Admin/LinkToImportView#LinkToImportView'],
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
          fields: [
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              hooks: {
                beforeChange: [
                  ({ data, value }) => {
                    if (data) {
                      data.imagesUpdatedAt = new Date().toISOString()
                    }
                    return value
                  },
                ],
              },
            },
            {
              name: 'imageGallery',
              type: 'array',
              labels: {
                singular: 'Image',
                plural: 'Images',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
              hooks: {
                beforeChange: [
                  ({ data, value }) => {
                    if (data) {
                      data.imagesUpdatedAt = new Date().toISOString()
                    }
                    return value
                  },
                ],
              },
            },
            {
              name: 'contactFormImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Image displayed in the contact form section of the listing page',
              },
            },
            {
              name: 'photosChangeTimestamp',
              type: 'text',
              admin: {
                hidden: true,
                condition: (_, siblingData) => siblingData?.category === 'residential',
              },
            },
            {
              name: 'majorChangeTimestamp',
              type: 'text',
              admin: {
                hidden: true,
                condition: (_, siblingData) => siblingData?.category === 'residential',
              },
            },
            {
              name: 'priceChangeTimestamp',
              type: 'text',
              admin: {
                hidden: true,
                condition: (_, siblingData) => siblingData?.category === 'residential',
              },
            },
            {
              name: 'statusChangeTimestamp',
              type: 'text',
              admin: {
                hidden: true,
                condition: (_, siblingData) => siblingData?.category === 'residential',
              },
            },
            {
              name: 'videosChangeTimestamp',
              type: 'text',
              admin: {
                hidden: true,
                condition: (_, siblingData) => siblingData?.category === 'residential',
              },
            },
            {
              name: 'contractStatusChangeTimestamp',
              type: 'text',
              admin: {
                hidden: true,
                condition: (_, siblingData) => siblingData?.category === 'residential',
              },
            },
            {
              name: 'documentsChangeTimestamp',
              type: 'text',
              admin: {
                hidden: true,
                condition: (_, siblingData) => siblingData?.category === 'residential',
              },
            },
            {
              name: 'category',
              type: 'select',
              options: [
                {
                  value: 'commercial',
                  label: 'Commercial',
                },
                {
                  value: 'residential',
                  label: 'Residential',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'bedrooms',
                  type: 'number',
                },
                {
                  name: 'bathrooms',
                  type: 'number',
                },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.category === 'residential',
              },
            },
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    OrderedListFeature(),
                    UnorderedListFeature(),
                    LinkFeature(),
                  ]
                },
              }),
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                },
                {
                  name: 'textAfterPrice',
                  type: 'text',
                },
                {
                  name: 'priceLabel',
                  type: 'text',
                  admin: {
                    description: 'Label to display instead of the price or "Contact for Price"',
                  },
                },
                {
                  name: 'propertyType',
                  type: 'relationship',
                  relationTo: 'property-types',
                  hasMany: true,
                  unique: false,
                },
              ],
            },

            {
              type: 'row',
              fields: [
                {
                  name: 'transactionType',
                  type: 'select',
                  options: [
                    {
                      label: 'For Sale',
                      value: 'for-sale',
                    },
                    {
                      label: 'For Lease',
                      value: 'for-lease',
                    },
                  ],
                },
                {
                  name: 'availability',
                  label: 'Status',
                  type: 'select',
                  options: [
                    {
                      label: 'Available',
                      value: 'available',
                    },
                    {
                      label: 'Unavailable',
                      value: 'unavailable',
                    },
                    {
                      label: 'Sold',
                      value: 'sold',
                    },
                    {
                      label: 'Active',
                      value: 'active',
                    },
                    {
                      label: 'Pending',
                      value: 'pending',
                    },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'area',
                  type: 'number',
                  admin: {
                    description: 'Square footage of the property',
                  },
                },
                {
                  name: 'acreage',
                  type: 'number',
                },
              ],
            },

            {
              name: 'streetAddress',
              type: 'text',
              required: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'city',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'state',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'zipCode',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'coordinates',
                  type: 'point',
                  required: true,
                },
              ],
            },
            {
              name: 'attachments',
              type: 'array',
              fields: [
                {
                  name: 'attachment',
                  type: 'upload',
                  relationTo: 'attachments',
                },
              ],
            },
            {
              name: 'videos',
              type: 'array',
              fields: [
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'title',
                  type: 'text',
                },
              ],
            },
            {
              name: 'virtualTourUrl',
              type: 'text',
            },
            {
              name: 'isFeatured',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'agents',
              type: 'relationship',
              relationTo: 'team-members',
              hasMany: true,
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
    ...slugField(),
    {
      name: 'MLS',
      label: 'MLS',
      type: 'group',
      admin: {
        description: 'This is used for Residential listings imported from NTREIS',
        condition: (_, siblingData) => siblingData?.category === 'residential',
      },
      fields: [
        {
          name: 'ListingKeyNumeric',
          type: 'number',
        },
        {
          name: 'MlsStatus',
          type: 'text',
        },
        {
          name: 'ListAgentKeyNumeric',
          type: 'number',
        },
        {
          name: 'ListAgentFullName',
          type: 'text',
        },
        {
          name: 'ListOfficeKeyNumeric',
          type: 'number',
        },
        {
          name: 'ListOfficeName',
          type: 'text',
        },
        {
          name: 'ModificationTimestamp',
          type: 'text',
        },
        {
          name: 'PhotosChangeTimestamp',
          type: 'text',
        },
        {
          name: 'PhotosCount',
          type: 'number',
        },
        {
          name: 'PropertySubType',
          type: 'text',
        },
        {
          name: 'FeaturedImageUrl',
          type: 'text',
        },
        {
          name: 'ImageGalleryUrls',
          type: 'array',
          fields: [
            {
              name: 'url',
              type: 'text',
            },
          ],
        },
        {
          name: 'LastSeenAt',
          type: 'date',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateListing],
    beforeChange: [
      populatePublishedAt,
      // validateListingSlug
    ],
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
