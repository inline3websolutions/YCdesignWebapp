import type { Block } from 'payload'

export const YCRestoredGallery: Block = {
  slug: 'ycRestoredGallery',
  labels: {
    singular: 'YC Restored Gallery',
    plural: 'YC Restored Galleries',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (optional)',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'highlight',
      type: 'text',
      label: 'Highlighted Word (optional)',
    },
    {
      name: 'motorcycles',
      type: 'relationship',
      relationTo: 'restored-moto',
      hasMany: true,
      required: true,
      minRows: 1,
      label: 'Select Motorcycles',
      admin: {
        description: 'Select which restored motorcycles to display in the gallery grid',
      },
    },
  ],
}
