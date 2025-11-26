import type { GlobalConfig } from 'payload'

import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Links',
      labels: {
        singular: 'Nav Link',
        plural: 'Nav Links',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
          admin: {
            description: 'Display name for desktop view',
          },
        },
        {
          name: 'mobileLabel',
          type: 'text',
          label: 'Mobile Label',
          admin: {
            description: 'Shorter label for mobile view (optional - uses Label if not set)',
          },
        },
        {
          name: 'linkType',
          type: 'radio',
          label: 'Link Type',
          defaultValue: 'custom',
          options: [
            { label: 'Internal Page', value: 'reference' },
            { label: 'Custom URL', value: 'custom' },
          ],
          admin: {
            layout: 'horizontal',
          },
        },
        {
          name: 'reference',
          type: 'relationship',
          label: 'Link to Page',
          relationTo: ['pages', 'posts'],
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === 'reference',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Custom URL',
          admin: {
            description: 'e.g., /portfolio, /#about, /sales',
            condition: (_, siblingData) => siblingData?.linkType === 'custom',
          },
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'CTA Button',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Button Label',
          defaultValue: 'Start Project',
        },
        {
          name: 'mobileLabel',
          type: 'text',
          label: 'Mobile Label',
          defaultValue: 'Start',
          admin: {
            description: 'Shorter label for mobile view',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Button URL',
          defaultValue: '/#contact',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
