import { rateLimit } from 'elysia-rate-limit'
import cfg from '@/config'
import check from './member-profile.checker'
import ctrl from './member-profile.controller'
import { jsonError } from '@/base/base.api'
import { authMiddleware } from '@/middlewares/auth.mid'

const prefix = '/v1/member/profile'

export default (app: any) =>
  app.group(prefix, (group: any) =>
    group
      .guard({ beforeHandle: [authMiddleware] })
      .use(rateLimit(cfg.RATELIMIT_GUARD_OPT))
      .get('/:uuid', (ctx: any) => ctrl.detail(ctx))
      .put('/:uuid', (ctx: any) => ctrl.edit(ctx), check.edit)
      .onError(({ code, error }: any) => jsonError(code, error.all))
  )
