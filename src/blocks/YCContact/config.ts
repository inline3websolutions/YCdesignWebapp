import type { Block } from 'payload'

export const YCContact: Block = {
  slug: 'ycContact',
  labels: {
    singular: 'YC Contact',
    plural: 'YC Contact Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Ready to Build Your Legend?',
      label: 'Heading',
    },
    {
      name: 'subheading',
      type: 'text',
      defaultValue:
        "Whether it's a full restoration or a custom modification, let's discuss your vision.",
      label: 'Subheading',
    },
    {
      name: 'whatsappLink',
      type: 'text',
      label: 'WhatsApp Link',
      admin: {
        description: 'Full WhatsApp URL (e.g., https://wa.me/919876543210)',
      },
    },
  ],
}
