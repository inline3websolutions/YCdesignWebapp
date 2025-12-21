import type { Block } from 'payload'

export const YCInstagramGrid: Block = {
  slug: 'ycInstagramGrid',
  labels: {
    singular: 'YC Instagram Grid',
    plural: 'YC Instagram Grids',
  },
  fields: [
    {
      name: 'instagramPosts',
      type: 'array',
      label: 'Instagram Posts',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Post Image',
        },
        {
          name: 'likes',
          type: 'number',
          required: true,
          defaultValue: 0,
          label: 'Likes Count',
        },
        {
          name: 'comments',
          type: 'number',
          required: true,
          defaultValue: 0,
          label: 'Comments Count',
        },
        {
          name: 'postUrl',
          type: 'text',
          required: true,
          label: 'Post URL',
          defaultValue: 'https://instagram.com/',
        },
      ],
    },
  ],
}
