import type { Block } from 'payload'

export const YCHero: Block = {
  slug: 'ycHero',
  labels: {
    singular: 'YC Hero',
    plural: 'YC Hero Blocks',
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      defaultValue: 'Preserving Legends.',
      label: 'Headline',
    },
    {
      name: 'location',
      type: 'text',
      defaultValue: 'Lower Parel, Mumbai',
      label: 'Location Text',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Custom Restoration Workshop',
      label: 'Tagline',
    },
  ],
}
