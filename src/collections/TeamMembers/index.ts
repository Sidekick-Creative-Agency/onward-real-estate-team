import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import { slugField } from '@/fields/Slug'
import { revalidateTeamMember } from './hooks/revalidateTeamMember'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { populateLastName } from './hooks/populateLastName'
import { revalidateTeamPage } from './hooks/revalidateTeamPage'
import { revalidateSignaturesPage } from './hooks/revalidateSignaturesPage'
import { populateSlug } from '@/utilities/populateSlug'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        afterRead: [populateLastName],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'details',
          fields: [
            {
              name: 'jobTitle',
              type: 'text',
              required: true,
            },
            {
              name: 'bio',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
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
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'designations',
              type: 'text',
            },
            {
              name: 'email',
              type: 'text',
            },
            {
              name: 'phone',
              type: 'text',
            },
            {
              name: 'socials',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Twitter', value: 'twitter' },
                    { label: 'YouTube', value: 'youtube' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                },
              ],
            },
            {
              name: 'eductationAndCertifications',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
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
              name: 'notableTransactions',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
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
              name: 'testimonials',
              type: 'array',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'testimonial',
                  type: 'textarea',
                  required: true,
                },
                {
                  name: 'rating',
                  type: 'number',
                  min: 1,
                  max: 5,
                  defaultValue: 5,
                  required: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
            {
              name: 'isLeadership',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'isRealtor',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'company',
              type: 'select',
              defaultValue: 'onward',
              options: [
                { label: 'Onward', value: 'onward' },
                { label: 'Alliance', value: 'alliance' },
              ],
            },
            {
              name: 'emailSignatureHeadshot',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'iabsForm',
              label: 'IABS Form',
              type: 'upload',
              relationTo: 'attachments',
            },
          ],
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
      name: 'relatedListings',
      type: 'join',
      collection: 'listings',
      on: 'agents',
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [populateSlug],
    afterChange: [revalidateTeamMember, revalidateTeamPage, revalidateSignaturesPage],
  },
}
