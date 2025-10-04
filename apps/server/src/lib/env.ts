import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const serverEnv = createEnv({
  server: {
    CORS_ORIGIN: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    DATABASE_URL: z.string(),
    POLYGON_RPC_URL: z.string().url(),
    ISSUER_PRIVATE_KEY: z.string(),
    CREDENTIAL_LEDGER_ADDRESS: z.string(),
    IPFS_API_URL: z.string().url().optional(),
    IPFS_GATEWAY_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    POLYGON_RPC_URL: process.env.POLYGON_RPC_URL,
    ISSUER_PRIVATE_KEY: process.env.ISSUER_PRIVATE_KEY,
    CREDENTIAL_LEDGER_ADDRESS: process.env.CREDENTIAL_LEDGER_ADDRESS,
    IPFS_API_URL: process.env.IPFS_API_URL,
    IPFS_GATEWAY_URL: process.env.IPFS_GATEWAY_URL,
  },
})
