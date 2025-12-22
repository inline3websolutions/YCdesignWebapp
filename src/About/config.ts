import { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About Us',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      label: 'Hero Section',
      type: 'group',
      fields: [
        {
          name: 'background',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Background Image',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'titlePart1',
              type: 'text',
              defaultValue: 'WHEELS',
              required: true,
              admin: { width: '33%' },
            },
            {
              name: 'titlePart2',
              type: 'text',
              defaultValue: 'INSTEAD',
              required: true,
              admin: { width: '33%' },
            },
            {
              name: 'titlePart3',
              type: 'text',
              defaultValue: 'OF WINGS',
              required: true,
              admin: { width: '33%' },
            },
          ],
        },
        {
          name: 'subtitle',
          type: 'text',
          defaultValue: 'The relentless pursuit of freedom, two wheels at a time.',
          required: true,
        },
        {
          name: 'establishedDate',
          type: 'text',
          defaultValue: 'ESTABLISHED 1990',
          required: true,
        },
      ],
    },
    {
      name: 'story',
      label: 'The Story Section',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'image1',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'image1Caption',
              type: 'text',
              label: 'Image 1 Caption',
              defaultValue: 'The Man Behind The Metal',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'title1',
          type: 'text',
          label: 'Title 1',
          required: true,
          defaultValue: 'THE MAN BEHIND THE METAL.',
        },
        {
          name: 'content1',
          type: 'richText',
          label: 'Content 1',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'image2',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'image2Caption',
              type: 'text',
              label: 'Image 2 Caption',
              defaultValue: 'Lower Parel Sanctum // 02',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'title2',
          type: 'text',
          label: 'Title 2',
          required: true,
          defaultValue: 'THE BIRTH OF YC DESIGN.',
        },
        {
          name: 'content2',
          type: 'richText',
          label: 'Content 2',
          required: true,
        },
      ],
    },
    {
      name: 'philosophy',
      label: 'Philosophy Section',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'ART IN MOTION.',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          defaultValue:
            'We don’t just put an engine on a frame. We believe every motorcycle that exits our shop is a work of art.',
        },
        {
          name: 'cards',
          type: 'array',
          minRows: 3,
          maxRows: 3,
          fields: [
            {
              name: 'icon',
              type: 'select',
              options: [
                { label: 'Zap', value: 'zap' },
                { label: 'Wrench', value: 'wrench' },
                { label: 'Shield', value: 'shield' },
              ],
              required: true,
            },
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'text',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'livingTheLife',
      label: 'Living The Life Section',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'LIVING THE LIFE.',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
        {
          name: 'images',
          type: 'array',
          maxRows: 2,
          minRows: 2,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
