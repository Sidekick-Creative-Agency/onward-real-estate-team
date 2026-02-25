import {  Field } from 'payload'

type BackgroundColorFieldType = (options?: { adminOverrides?: Record<string, unknown> }) => Field

export const TextColorField: BackgroundColorFieldType = ({ adminOverrides = {} } = {}) => {
  return {
    type: 'text',
    name: 'textColor',
    admin: {
      components: {
        afterInput: ['@/components/ColorPicker'],
      },
      ...adminOverrides,
    },
  }
}
