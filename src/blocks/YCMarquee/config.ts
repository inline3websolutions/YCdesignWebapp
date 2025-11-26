import type { Block } from 'payload'

export const YCMarquee: Block = {
  slug: 'ycMarquee',
  labels: {
    singular: 'YC Marquee',
    plural: 'YC Marquees',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Item',
        plural: 'Items',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'accent',
      type: 'text',
      label: 'Accent Word (optional)',
      required: false,
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'yellow',
      options: [
        { label: 'Yellow', value: 'yellow' },
        { label: 'Dark', value: 'dark' },
      ],
    },
    {
      name: 'tilted',
      type: 'checkbox',
      label: 'Tilt strip slightly',
      defaultValue: true,
    },
  ],
}
