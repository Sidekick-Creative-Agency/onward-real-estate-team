import { postgresAdapter } from '@payloadcms/db-postgres'

import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import sharp from 'sharp' // editor-import
import { UnderlineFeature } from '@payloadcms/richtext-lexical'
import path from 'path'
import { Block, buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import Categories from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import Users from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { revalidateRedirects } from './hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { Listing, Page, Post, TeamMember } from 'src/payload-types'

import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { PhoneNumber, PhoneNumberField } from './blocks/Form/PhoneNumber/Field'
import { TextField } from './blocks/Form/Text/Field/input'
import { CheckboxField } from './blocks/Form/Checkbox/Field/input'
import { CountryField } from './blocks/Form/Country/Field/input'
import { EmailField } from './blocks/Form/Email/Field/input'
import { NumberField } from './blocks/Form/Number/Field/input'
import { StateField } from './blocks/Form/State/Field/input'
import { TextAreaField } from './blocks/Form/Textarea/Field/input'
import { Listings } from './collections/Listings'
import { Attachments } from './collections/Attachments'
import { PropertyTypes } from './collections/PropertyTypes'
import { Reviews } from './collections/Reviews'
import { TeamMembers } from './collections/TeamMembers'
import { JobListings } from './collections/JobListings'
import { s3Storage } from '@payloadcms/storage-s3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const generateTitle: GenerateTitle<Post | Page | Listing | TeamMember> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Onward Real Estate Team` : 'Onward Real Estate Team'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  return doc?.slug
    ? `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/${doc.slug}`
    : `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}`
}

export default buildConfig({
  admin: {
    components: {
      graphics: {
        Logo: '@/components/LoginLogo',
        Icon: '@/components/AdminLogo',
      },
      views: {
        importListingsView: {
          Component: '/views/Listings/Import#ImportView',
          path: '/import/listings',
        },
        importPostsView: {
          Component: '/views/Posts/Import#ImportView',
          path: '/import/posts',
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: lexicalEditor({
    features: () => {
      return [
        ParagraphFeature(),
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        LinkFeature({
          enabledCollections: ['pages', 'posts', 'team-members'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
      ]
    },
  }),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    Listings,
    Attachments,
    PropertyTypes,
    Reviews,
    TeamMembers,
    JobListings,
  ],
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    redirectsPlugin({
      collections: ['pages', 'posts', 'listings'],
      overrides: {
        // @ts-expect-error
        fields: ({ defaultFields }) => {
          return defaultFields.map((field) => {
            if ('name' in field && field.name === 'from') {
              return {
                ...field,
                admin: {
                  description: 'You will need to rebuild the website when changing this field.',
                },
              }
            }
            return field
          })
        },
        hooks: {
          afterChange: [revalidateRedirects],
        },
      },
    }),
    nestedDocsPlugin({
      collections: ['categories', 'pages'],
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
    seoPlugin({
      generateTitle,
      generateURL,
    }),
    formBuilderPlugin({
      fields: {
        payment: false,
        phoneNumber: PhoneNumber,
        text: TextField,
        checkbox: CheckboxField,
        country: CountryField,
        email: EmailField,
        number: NumberField,
        state: StateField,
        textarea: TextAreaField,
      },
      formOverrides: {
        fields: ({ defaultFields }) => {
          return [
            ...defaultFields.map((field) => {
              if ('name' in field && field.name === 'confirmationMessage') {
                return {
                  ...field,
                  editor: lexicalEditor({
                    features: ({ rootFeatures }) => {
                      return [
                        ...rootFeatures,
                        FixedToolbarFeature(),
                        HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                      ]
                    },
                  }),
                }
              }
              return field
            }),
          ]
        },
      },
    }),
    searchPlugin({
      collections: ['posts'],
      beforeSync: beforeSyncWithSearch,
      searchOverrides: {
        fields: ({ defaultFields }) => {
          return [...defaultFields, ...searchFields]
        },
      },
    }),
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
        attachments: {
          prefix: 'attachments',
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        endpoint: process.env.S3_ENDPOINT || '',
        region: process.env.S3_REGION,
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
