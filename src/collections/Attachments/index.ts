import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { beforeChangeHook } from './hooks/beforeChangeHook'
import { beforeOperationHook } from './hooks/beforeOperationHook'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Attachments: CollectionConfig = {
  slug: 'attachments',
  // admin: {
  //   components: {
  //     edit: {
  //       Upload: '@/components/Upload/AttachmentsUpload#AttachmentsUpload',
  //     },
  //   },
  // },

  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'relatedListings',
      type: 'join',
      collection: 'listings',
      on: 'attachments.attachment',
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    mimeTypes: ['application/pdf'],
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
    beforeChange: [beforeChangeHook],
    beforeOperation: [beforeOperationHook],
  },
}
