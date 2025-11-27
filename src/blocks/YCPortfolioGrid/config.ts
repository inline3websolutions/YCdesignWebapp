import type { Block } from 'payload'

export const YCPortfolioGrid: Block = {
  slug: 'ycPortfolioGrid',
  labels: {
    singular: 'YC Portfolio Grid',
    plural: 'YC Portfolio Grids',
  },
  fields: [
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Our Work',
      label: 'Subtitle / Eyebrow',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Restored Legends',
      label: 'Title',
    },
    {
      name: 'portfolioType',
      type: 'select',
      required: true,
      defaultValue: 'restored',
      options: [
        { label: 'Restored Motorcycles', value: 'restored' },
        { label: 'Custom Motorcycles', value: 'custom' },
      ],
      label: 'Portfolio Type',
      admin: {
        description: 'Select which collection to display',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 12,
      label: 'Number of Items',
      admin: {
        description: 'How many projects to display (1-12)',
      },
    },
    {
      name: 'viewAllLink',
      type: 'text',
      defaultValue: '/portfolio?filter=Restoration',
      label: 'View All Link',
      admin: {
        description: 'URL for the "View All" button (e.g., /portfolio?filter=Restoration or /portfolio?filter=Modification)',
      },
    },
  ],
}
