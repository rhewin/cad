import { attempt, decode64 } from '@/utils/helper.util'
import { jsonError } from '@/base/base.api'
import type { JwtPayload } from '@/base/index'

export const authMiddleware = async (ctx: any) => {
  const token = ctx.request.headers
    .get('Authorization')
    ?.replace('Bearer ', '')
    .trim()

  if (!token) {
    return jsonError('UNAUTHORIZED')
  }

  const [payload, err] = await attempt(() => ctx.jwt.verify(token))
  if (err || !payload) {
    return jsonError('UNAUTHORIZED')
  }

  const decoded = JSON.parse(decode64((payload as JwtPayload).data))
  ctx.user = decoded
}
