// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { s3Storage } from '@payloadcms/storage-s3'
import { Media } from './collections/Media'
import { NewestMedia } from './collections/NewestMedia'
import { NewMedia } from './collections/NewMedia'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, NewMedia, NewestMedia],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // Generates endpoint /storage-s3-generate-signed-url
    s3Storage({
      clientUploads: true,
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET1!,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        region: process.env.S3_REGION,
      },
    }),
    // Generates endpoint /storage-s3-generate-signed-url-1
    s3Storage({
      clientUploads: true,
      collections: {
        'new-media': true,
      },
      bucket: process.env.S3_BUCKET2!,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        region: process.env.S3_REGION,
      },
    }),
    s3Storage({
      // Also generates endpoint /storage-s3-generate-signed-url-1, causing an error: "Collection credit-certificates was not found in S3 options"
      clientUploads: true,
      collections: {
        'new-media': true,
      },
      bucket: process.env.S3_BUCKET3!,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        region: process.env.S3_REGION,
      },
    }),
  ],
})
