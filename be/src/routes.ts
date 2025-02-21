import { refreshAccToken } from './base/base.controller'
import { toSwaggerYaml } from './utils/swagger.util'
import { jsonOk } from './base/base.api'
import { refreshToken } from './base/base.checker.ts'
import adminRoutes from './dom-admin/admin.router'
import memberRoutes from './dom-member/member.router'

const routes = (app: any) =>
  app
    .get('/swagger/generate', () => toSwaggerYaml())
    .post('/refresh-token', (ctx: any) => refreshAccToken(ctx), refreshToken)
    .get('/', () => jsonOk(null, 'Welcome!'))
    .use(adminRoutes)
    .use(memberRoutes)

export default routes
