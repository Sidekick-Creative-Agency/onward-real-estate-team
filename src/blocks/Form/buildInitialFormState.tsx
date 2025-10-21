import type { FormFieldBlock } from '@payloadcms/plugin-form-builder/types'
import { PhoneNumberField } from './PhoneNumber/Field'
import { PageTitleField } from './PageTitle/Field/input'
import { TeamMemberEmailField } from './TeamMemberEmail/Field/input'
import { PageSlugField } from './PageSlug/Field/input'

export const buildInitialFormState = (
  fields: (FormFieldBlock | PhoneNumberField | PageTitleField | PageSlugField | TeamMemberEmailField)[],
) => {
  return fields?.reduce((initialSchema, field) => {
    if (field.blockType === 'checkbox') {
      return {
        ...initialSchema,
        [field.name]: field.defaultValue,
      }
    }
    if (field.blockType === 'country') {
      return {
        ...initialSchema,
        [field.name]: '',
      }
    }
    if (field.blockType === 'email') {
      return {
        ...initialSchema,
        [field.name]: '',
      }
    }
    if (field.blockType === 'text') {
      return {
        ...initialSchema,
        [field.name]: '',
      }
    }
    if (field.blockType === 'select') {
      return {
        ...initialSchema,
        [field.name]: '',
      }
    }
    if (field.blockType === 'state') {
      return {
        ...initialSchema,
        [field.name]: '',
      }
    }
    if (field.blockType === 'phoneNumber') {
      return {
        ...initialSchema,
        [field.name]: '',
      }
    }
    if (field.blockType === 'pageTitle') {
      return {
        ...initialSchema,
        [field.name]: '',
      }
    }
    if (field.blockType === 'pageSlug') {
      return {
        ...initialSchema,
        [field.name]: '',
      }
    }
    if (field.blockType === 'teamMemberEmail') {
      return {
        ...initialSchema,
        [field.name]: '',
      }
    }
  }, {})
}
