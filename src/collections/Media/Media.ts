import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { generateBlurHash } from './hooks/generateBlurHash'


export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
    {
      type: 'join',
      collection: 'listings',
      name: 'relatedListingFeaturedImage',
      on: 'featuredImage',
    },
    {
      type: 'join',
      collection: 'listings',
      name: 'relatedListingImageGallery',
      on: 'imageGallery.image',
    },
    {
      name: 'blurhash',
      type: 'text',
      admin: {
        hidden: true,
        disableListColumn: true,
        disableListFilter: true,
      },
    },
  ],
  upload: {
    adminThumbnail: 'thumbnail',
    // NOTE: `formatOptions` is intentionally NOT set at the upload level.
    // With `clientUploads: true` the browser PUTs the original file straight to
    // S3, so the server can't convert the main file to webp — doing so would
    // record a `.webp` main filename that never gets uploaded (404s). Instead we
    // convert each generated size to webp individually below.
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        formatOptions: {
          format: 'webp',
          options: {
            compression: 'webp',
          },
        },
      },
      {
        name: 'square',
        width: 500,
        height: 500,
        formatOptions: {
          format: 'webp',
          options: {
            compression: 'webp',
          },
        },
      },
      {
        name: 'medium',
        width: 900,
        formatOptions: {
          format: 'webp',
          options: {
            compression: 'webp',
          },
        },
      },
      {
        name: 'xlarge',
        width: 1920,
        formatOptions: {
          format: 'webp',
          options: {
            compression: 'webp',
          },
        },
      },
    ],
    mimeTypes: [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/svg+xml',
      'application/pdf',
    ],
    pasteURL: {
      allowList: [
        {
          hostname: 'images.unsplash.com',
          protocol: 'https',
        },
      ],
    },
  },
  hooks: {
    beforeValidate: [generateBlurHash],
  },
}
