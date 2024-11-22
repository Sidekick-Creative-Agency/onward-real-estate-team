import { Field } from 'payload'

export const DesktopVerticalPaddingField: Field = {
  type: 'row',
  fields: [
    {
      name: 'paddingVerticalDesktopValue', // required
      label: 'Vertical Padding',
      type: 'number', // required
      defaultValue: 5,
    },
    {
      name: 'paddingVerticalDesktopUnit',
      enumName: 'pb_columns_block_style_group_pad_vert_desktop_unit',
      label: 'Unit',
      type: 'select',
      defaultValue: 'rem',
      options: [
        {
          value: 'rem',
          label: 'rem',
        },
        {
          value: 'px',
          label: 'px',
        },
        {
          value: '%',
          label: '%',
        },
      ],
    },
  ],
}
