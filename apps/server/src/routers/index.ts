import type { RouterClient } from '@orpc/server'

import { protectedProcedure, publicProcedure } from '../lib/orpc'
import { todoRouter } from './todo'
import { certificateRouter } from './certificate'

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return 'OK'
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: 'This is private',
      user: context.session?.user,
    }
  }),
  todo: todoRouter,
  certificate: certificateRouter,
}
export type AppRouter = typeof appRouter
export type AppRouterClient = RouterClient<typeof appRouter>
