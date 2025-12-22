import type { Block } from 'payload'

export const YCHeroSlider: Block = {
  slug: 'ycHeroSlider',
  labels: {
    singular: 'YC Hero Slider',
    plural: 'YC Hero Sliders',
  },
  fields: [
    {
      name: 'slides',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: false,
          label: 'Title',
        },
        {
          name: 'highlight',
          type: 'text',
          required: false,
          label: 'Highlight Text',
        },
        {
          name: 'subtitle',
          type: 'text',
          required: false,
          label: 'Subtitle',
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
          label: 'Description',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Desktop Background Image',
        },
        {
          name: 'mobileImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Mobile Background Image',
        },
        {
          name: 'coords',
          type: 'text',
          label: 'Coordinates',
          required: false,
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Tag',
          required: false,
        },
      ],
    },
  ],
}
