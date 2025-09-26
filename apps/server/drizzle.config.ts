import { defineConfig } from 'drizzle-kit'

import { serverEnv } from '@/lib/env'

export default defineConfig({
  schema: './src/db/schema',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
})
