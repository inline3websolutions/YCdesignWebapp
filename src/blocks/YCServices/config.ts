import type { Block } from 'payload'

export const YCServices: Block = {
  slug: 'ycServices',
  labels: {
    singular: 'YC Services',
    plural: 'YC Services Blocks',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      defaultValue: 'Our Expertise',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Service',
        plural: 'Services',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Hover Image',
        },
      ],
    },
  ],
}
