import {
  AlignFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block, Field } from 'payload'

const timelineItemFields: Field[] = [
  {
    type: 'group',
    name: 'tab',
    fields: [
      {
        name: 'icon',
        type: 'upload',
        relationTo: 'media',
      },
      {
        name: 'title',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    type: 'group',
    name: 'content',
    fields: [
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
      },
      {
        name: 'richText',
        type: 'richText',
        editor: lexicalEditor({
          features: ({ rootFeatures }) => {
            return [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
              AlignFeature(),
            ]
          },
        }),
      },
    ],
  },
]

export const TimelineBlock: Block = {
  slug: 'timelineBlock',
  interfaceName: 'TimelineBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'timelineItems',
      type: 'array',
      fields: timelineItemFields,
    },
  ],
}