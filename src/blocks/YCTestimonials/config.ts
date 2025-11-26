import type { Block } from 'payload'

export const YCTestimonials: Block = {
  slug: 'ycTestimonials',
  labels: {
    singular: 'YC Testimonials',
    plural: 'YC Testimonials Blocks',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Client Stories',
      label: 'Eyebrow Text',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'RIDE EXPERIENCE',
      label: 'Title',
    },
    {
      name: 'testimonials',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Testimonial',
        plural: 'Testimonials',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          required: true,
          label: 'Testimonial Text',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Client Name',
        },
        {
          name: 'role',
          type: 'text',
          label: 'Role / Title',
        },
      ],
    },
  ],
}
