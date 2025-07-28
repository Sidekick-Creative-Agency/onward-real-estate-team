import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
  LinkFeature,
} from '@payloadcms/richtext-lexical'
import { AdvancedFields } from '@/fields/Advanced'
import { DescriptionField } from './UI/Description/config'

export const JobListingsBlock: Block = {
  slug: 'jobListingsBlock',
  interfaceName: 'JobListingsBlock',
  admin: {
    components: {},
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'subtitle',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature(), LinkFeature()]
        },
      }),
    },
    AdvancedFields,
    DescriptionField,
  ],
}
