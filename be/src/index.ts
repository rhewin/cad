import { Elysia } from 'elysia'
import { jsonError } from '@/base/base.api'
import { initSwagger } from './utils/swagger.util'
import { loggerMiddleware } from './middlewares/logger.mid'
import { log, packages } from './packages'
import routes from './routes'
import cfg from './config'

new Elysia()
  .use(packages)
  .use(initSwagger)
  .use(routes)
  .onRequest(loggerMiddleware)
  .onError(({ code }) => jsonError(String(code)))
  .listen(cfg.APP_PORT)

log.info(`Server running at localhost:${cfg.APP_PORT}`)
