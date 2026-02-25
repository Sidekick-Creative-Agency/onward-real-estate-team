import {  Field } from 'payload'

type BackgroundColorFieldType = (options?: { adminOverrides?: Record<string, unknown> }) => Field

export const BackgroundColorField: BackgroundColorFieldType = ({ adminOverrides = {} } = {}) => {
  return {
    type: 'text',
    name: 'backgroundColor',
    admin: {
      components: {
        afterInput: ['@/components/ColorPicker'],
      },
      ...adminOverrides,
    },
  }
}
