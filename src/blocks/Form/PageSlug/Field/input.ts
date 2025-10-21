import { formatFormFieldName } from '@/utilities/validateFieldName'
import { Block } from 'payload'

export interface PageSlugField {
  blockName?: string
  blockType: 'pageSlug'
  defaultValue?: string
  name: string
}

export const PageSlug: Block = {
  slug: 'pageSlug',
  fields: [
    {
      name: 'name',
      type: 'text',
      hooks: {
        beforeValidate: [({ value }) => formatFormFieldName(value)],
      },
    },
    {
      name: 'title',
      type: 'text',
      hidden: true,
    },
    {
      type: 'ui',
      name: 'message',
      admin: {
        components: {
          Field: '@/blocks/Form/PageSlug/FieldMessage/index#FieldMessage',
        },
      },
    },
  ],
}
