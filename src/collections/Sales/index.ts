import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { revalidateSale, revalidateDelete } from './hooks/revalidateSale'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

export const Sales: CollectionConfig<'sales'> = {
  slug: 'sales',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    price: true,
    status: true,
    mainImage: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'price', 'status', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Bike Title',
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'manufacturer',
                  type: 'relationship',
                  relationTo: 'manufacturers',
                  required: true,
                  label: 'Manufacturer',
                  hasMany: false,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'price',
                  type: 'text',
                  required: true,
                  label: 'Price (₹)',
                  admin: {
                    placeholder: '4,50,000',
                    width: '50%',
                  },
                },
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'available',
                  options: [
                    { label: 'Available', value: 'available' },
                    { label: 'Reserved', value: 'reserved' },
                    { label: 'Sold', value: 'sold' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'year',
                  type: 'number',
                  required: true,
                  label: 'Year',
                  min: 1850,
                  max: new Date().getFullYear() + 1,
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'engine',
                  type: 'text',
                  required: true,
                  label: 'Engine',
                  admin: {
                    placeholder: '750cc Inline-4',
                    width: '33%',
                  },
                },
                {
                  name: 'mileage',
                  type: 'text',
                  required: true,
                  label: 'Mileage',
                  admin: {
                    placeholder: '24,000 km',
                    width: '33%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'numberOfOwners',
                  type: 'text',
                  label: 'Number of Owners',
                  admin: {
                    width: '50%',
                    placeholder: '1st Owner',
                  },
                },
                {
                  name: 'registrationDate',
                  type: 'date',
                  label: 'Registration Date',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'registrationState',
                  type: 'select',
                  admin: {
                    position: 'sidebar',
                    description: 'State/UT where the bike is registered',
                    width: '50%',
                  },
                  options: [
                    { label: 'Andaman and Nicobar Islands - AN', value: 'AN' },
                    { label: 'Andhra Pradesh - AP', value: 'AP' },
                    { label: 'Arunachal Pradesh - AR', value: 'AR' },
                    { label: 'Assam - AS', value: 'AS' },
                    { label: 'Bihar - BR', value: 'BR' },
                    { label: 'Chandigarh - CH', value: 'CH' },
                    { label: 'Chhattisgarh - CG', value: 'CG' },
                    { label: 'Dadra and Nagar Haveli and Daman and Diu - DD', value: 'DD' },
                    { label: 'Delhi - DL', value: 'DL' },
                    { label: 'Goa - GA', value: 'GA' },
                    { label: 'Gujarat - GJ', value: 'GJ' },
                    { label: 'Haryana - HR', value: 'HR' },
                    { label: 'Himachal Pradesh - HP', value: 'HP' },
                    { label: 'Jammu and Kashmir - JK', value: 'JK' },
                    { label: 'Jharkhand - JH', value: 'JH' },
                    { label: 'Karnataka - KA', value: 'KA' },
                    { label: 'Kerala - KL', value: 'KL' },
                    { label: 'Ladakh - LA', value: 'LA' },
                    { label: 'Lakshadweep - LD', value: 'LD' },
                    { label: 'Madhya Pradesh - MP', value: 'MP' },
                    { label: 'Maharashtra - MH', value: 'MH' },
                    { label: 'Manipur - MN', value: 'MN' },
                    { label: 'Meghalaya - ML', value: 'ML' },
                    { label: 'Mizoram - MZ', value: 'MZ' },
                    { label: 'Nagaland - NL', value: 'NL' },
                    { label: 'Odisha - OD', value: 'OD' },
                    { label: 'Puducherry - PY', value: 'PY' },
                    { label: 'Punjab - PB', value: 'PB' },
                    { label: 'Rajasthan - RJ', value: 'RJ' },
                    { label: 'Sikkim - SK', value: 'SK' },
                    { label: 'Tamil Nadu - TN', value: 'TN' },
                    { label: 'Telangana - TG', value: 'TG' },
                    { label: 'Tripura - TR', value: 'TR' },
                    { label: 'Uttar Pradesh - UP', value: 'UP' },
                    { label: 'Uttarakhand - UK', value: 'UK' },
                    { label: 'West Bengal - WB', value: 'WB' },
                  ],
                },
              ],
            },
            {
              name: 'mainImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Main Image',
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Gallery Images',
            },
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: 'Description',
              required: true,
            },
            {
              name: 'features',
              type: 'array',
              label: 'Features & Modifications',
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateSale],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
