import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { db } from '../db'
import * as schema from '../db/schema'
import { serverEnv } from './env'

export const auth = betterAuth<BetterAuthOptions>({
  appName: 'Skill Chain',
  telemetry: {
    enabled: false,
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema,
  }),
  trustedOrigins: [serverEnv.CORS_ORIGIN || ''],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    cookiePrefix: 'skill-chain',
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    },
    database: {
      generateId: false,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
  },
})
