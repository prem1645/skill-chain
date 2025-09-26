import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const webEnv = createEnv({
  client: {
    NEXT_PUBLIC_SERVER_URL: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  },
})
