import type { CollectionConfig } from 'payload'

export const NewestMedia: CollectionConfig = {
  slug: 'newest-media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
