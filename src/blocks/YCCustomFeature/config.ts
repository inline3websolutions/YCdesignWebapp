import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const YCCustomFeature: Block = {
  slug: 'ycCustomFeature',
  labels: {
    singular: 'YC Custom Feature',
    plural: 'YC Custom Features',
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      label: 'Section Title',
    },
    {
      name: 'bigFeature',
      type: 'group',
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
          name: 'subtitle',
          type: 'text',
        },
      ],
    },
    {
      name: 'sideImage',
      type: 'group',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'title',
          type: 'text',
        },
      ],
    },
    {
      name: 'ctaTile',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        linkGroup({
          overrides: {
            name: 'link',
            label: 'CTA Link',
            maxRows: 1,
          },
        }),
      ],
    },
  ],
}
