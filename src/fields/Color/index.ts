import {  Field } from 'payload'

type ColorFieldType = (options?: {
  name?: string
  adminOverrides?: Record<string, unknown>
}) => Field

export const ColorField: ColorFieldType = ({ name = 'color', adminOverrides = {} } = {}) => {
  return {
    type: 'text',
    name: name,
    admin: {
      components: {
        afterInput: ['@/components/ColorPicker'],
      },
      ...adminOverrides,
    },
  }
}
