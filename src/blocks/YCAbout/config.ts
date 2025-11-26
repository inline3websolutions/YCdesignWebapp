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
      label: 'Eyebrow (optional)',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'highlight',
      type: 'text',
      required: false,
      label: 'Highlighted Word',
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
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
    },
    {
      name: 'label',
      type: 'text',
      label: 'Corner Label (e.g. 01)',
    },
  ],
}
