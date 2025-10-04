import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { onError } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'

import 'dotenv/config'

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { auth } from './lib/auth'
import { createContext } from './lib/context'
import { serverEnv } from './lib/env'
import { appRouter } from './routers/index'

const app = new Hono()

app.use(logger())
app.use(
  '/*',
  cors({
    origin: serverEnv.CORS_ORIGIN,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))

export const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      docsPath: '/reference',
      docsTitle: 'Skill Chain API documentation',
      specGenerateOptions: {
        info: {
          title: 'Skill Chain API reference',
          version: '1.0.0',
          description: 'Skill Chain API for managing resources',
        },
      },
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
})

export const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
})

// RPC API routes
app.use('api/v1/*', async (c, next) => {
  const context = await createContext({ context: c })

  const rpcResult = await rpcHandler.handle(c.req.raw, {
    prefix: '/api/v1/rpc',
    context: context,
  })

  if (rpcResult.matched) {
    return c.newResponse(rpcResult.response.body, rpcResult.response)
  }

  const apiResult = await apiHandler.handle(c.req.raw, {
    prefix: '/api/v1',
    context: context,
  })

  if (apiResult.matched) {
    return c.newResponse(apiResult.response.body, apiResult.response)
  }

  await next()
})

// REST API routes for frontend compatibility
app.use('api/*', async (c, next) => {
  const context = await createContext({ context: c })

  const apiResult = await apiHandler.handle(c.req.raw, {
    prefix: '/api',
    context: context,
  })

  if (apiResult.matched) {
    return c.newResponse(apiResult.response.body, apiResult.response)
  }

  await next()
})

app.get('/', (c) => {
  return c.text('OK')
})

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)
