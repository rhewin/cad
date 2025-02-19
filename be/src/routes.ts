import memberRoutes from './dom-member/member.router'
import adminRoutes from './dom-admin/admin.router'
import { toSwaggerYaml } from './utils/swagger.util'
import { jsonOk } from './base/base.api'

const routes = (app: any) =>
  app
    .get('/', () => jsonOk(null, 'Welcome!'))
    .get('/swagger/generate', () => toSwaggerYaml())
    .use(adminRoutes)
    .use(memberRoutes)

export default routes
