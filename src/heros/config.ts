import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Animated GSAP',
          value: 'animatedGsap',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'tagline',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'animatedGsap',
      },
    },
    {
      name: 'established',
      type: 'text',
      defaultValue: 'Est. Mumbai 2015',
      admin: {
        condition: (_, { type } = {}) => type === 'animatedGsap',
      },
    },
    {
      name: 'scrollIndicator',
      type: 'checkbox',
      label: 'Show Scroll Indicator',
      admin: {
        condition: (_, { type } = {}) => type === 'animatedGsap',
      },
    },
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) =>
          ['highImpact', 'mediumImpact', 'animatedGsap'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
