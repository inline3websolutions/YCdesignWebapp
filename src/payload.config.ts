import { mongooseAdapter } from '@payloadcms/db-mongodb'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { RestoredMoto } from './collections/RestoredMoto'
import { CustomMotorcycles } from './collections/CustomMotorcycles'
import { Sales } from './collections/Sales'
import { Spares } from './collections/Spares'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Manufacturers } from './collections/Manufacturers'
import { About } from './About/config'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { SiteSettings } from './SiteSettings/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

import { s3Storage } from '@payloadcms/storage-s3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      // beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      // beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    // Determine which database URL to use:
    // - DATABASE_URI: Internal Railway URL (only works inside Railway network during actual deployment)
    // - BUILD_DATABASE: Public URL, works from anywhere (local dev, external services)
    //
    // RAILWAY_DEPLOYMENT_ID is set ONLY during actual Railway deployments (build + runtime)
    // It is NOT set by `railway run` locally, making it a reliable way to detect real deployments
    url: (() => {
      const isRailwayDeployment = !!process.env.RAILWAY_DEPLOYMENT_ID
      const databaseUri = process.env.DATABASE_URI || ''
      const buildDatabase = process.env.BUILD_DATABASE || ''

      if (isRailwayDeployment) {
        // On Railway: prefer internal URL for cost savings
        return databaseUri || buildDatabase
      }

      // Local dev (including `railway run`): use public URL
      return buildDatabase || databaseUri
    })(),
  }),
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    RestoredMoto,
    CustomMotorcycles,
    Sales,
    Spares,
    ContactSubmissions,
    Manufacturers,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, SiteSettings, About],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION,
        forcePathStyle: true,
        endpoint: process.env.S3_ENDPOINT,
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
