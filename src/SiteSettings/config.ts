import type { GlobalConfig } from 'payload'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'enableLoader',
      type: 'checkbox',
      label: 'Enable Interactive Loader',
      defaultValue: true,
      admin: {
        description: 'Toggle the initial loading animation on or off.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
