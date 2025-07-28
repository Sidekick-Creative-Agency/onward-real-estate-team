import { TextColorFeature } from '@/components/RichText/Color/features/textColor/feature.server'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

export const MessageField: Block = {
  slug: 'message',
  fields: [
    {
      name: 'message',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            TextColorFeature(),
          ]
        },
      }),
    },
  ],
}
