import type { GlobalConfig } from 'payload'

import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue:
        'Preserving Legends. Building Icons. We specialize in bringing vintage mechanical souls back to life with modern precision and retro-futuristic aesthetics.',
      admin: {
        description: 'Short description text shown below the logo',
      },
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Media Links',
      fields: [
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram URL',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
        },
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
        },
        {
          name: 'youtube',
          type: 'text',
          label: 'YouTube URL',
        },
      ],
    },
    {
      name: 'exploreLinks',
      type: 'array',
      label: 'Explore Links',
      labels: {
        singular: 'Link',
        plural: 'Links',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
          admin: {
            description: 'e.g., /portfolio, /#about, /sales',
          },
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'addressLine1',
          type: 'text',
          label: 'Address Line 1',
          defaultValue: 'Lower Parel, Mumbai,',
        },
        {
          name: 'addressLine2',
          type: 'text',
          label: 'Address Line 2',
          defaultValue: 'Maharashtra, India',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
          defaultValue: '+91 98765 43210',
        },
      ],
    },
    {
      name: 'legalLinks',
      type: 'group',
      label: 'Legal Links',
      fields: [
        {
          name: 'privacyPolicy',
          type: 'text',
          label: 'Privacy Policy URL',
          defaultValue: '/privacy',
        },
        {
          name: 'termsOfService',
          type: 'text',
          label: 'Terms of Service URL',
          defaultValue: '/terms',
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      label: 'Copyright Text',
      defaultValue: 'YC Design. All rights reserved.',
      admin: {
        description: 'Year will be automatically prepended',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
