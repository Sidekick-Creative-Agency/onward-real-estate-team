import { TextColorFeature } from '@/components/RichText/Color/features/textColor/feature.server'
import { BRAND_COLORS } from '@/utilities/constants'
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
    },
  ],
}
