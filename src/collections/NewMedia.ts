import type { CollectionConfig } from 'payload'

export const NewMedia: CollectionConfig = {
  slug: 'new-media',
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
