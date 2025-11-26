import type { Block } from 'payload'

export const YCRestoredGallery: Block = {
  slug: 'ycRestoredGallery',
  labels: {
    singular: 'YC Restored Gallery',
    plural: 'YC Restored Galleries',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (optional)',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'highlight',
      type: 'text',
      label: 'Highlighted Word (optional)',
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      required: true,
      labels: {
        singular: 'Card',
        plural: 'Cards',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Tag / Meta',
        },
      ],
    },
  ],
}
