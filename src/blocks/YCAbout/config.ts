import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const YCAbout: Block = {
  slug: 'ycAbout',
  labels: {
    singular: 'YC About',
    plural: 'YC About Blocks',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (e.g. "The Workshop")',
      defaultValue: 'The Workshop',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'ENGINEERING',
      label: 'Heading (first line)',
    },
    {
      name: 'highlight',
      type: 'text',
      required: false,
      label: 'Subheading (second line, muted color)',
      defaultValue: 'SOUL & SPEED.',
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      label: 'Description',
    },
    linkGroup({
      overrides: {
        name: 'primaryLink',
        label: 'Primary Link',
        maxRows: 1,
      },
    }),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Main Image',
    },
    {
      name: 'cornerLabel',
      type: 'text',
      label: 'Corner Badge (e.g. "YC")',
      defaultValue: 'YC',
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Statistics',
      maxRows: 2,
      fields: [
        {
          name: 'value',
          type: 'number',
          required: true,
          label: 'Number Value',
        },
        {
          name: 'suffix',
          type: 'text',
          label: 'Suffix (e.g. "+", "%")',
          defaultValue: '+',
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
        },
      ],
    },
  ],
}
