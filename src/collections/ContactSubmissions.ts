import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const ContactSubmissions: CollectionConfig<'contact-submissions'> = {
  slug: 'contact-submissions',
  access: {
    create: () => true, // Allow anyone to submit
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'subject', 'createdAt'],
    useAsTitle: 'name',
    group: 'Forms',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone',
    },
    {
      name: 'subject',
      type: 'select',
      required: true,
      options: [
        { label: 'Restoration Project', value: 'restoration' },
        { label: 'Custom Build', value: 'custom' },
        { label: 'Bike Purchase Inquiry', value: 'purchase' },
        { label: 'General Inquiry', value: 'general' },
      ],
    },
    {
      name: 'bikeInterest',
      type: 'text',
      label: 'Bike of Interest',
      admin: {
        condition: (data) => data?.subject === 'purchase',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Message',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Responded', value: 'responded' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
