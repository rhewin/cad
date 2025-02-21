import type { JwtPayload } from '@/base/index'
import { attempt, decode64 } from '@/utils/helper.util'
import { jsonError } from '@/base/base.api'

export const authMiddleware = async (ctx: any) => {
  const token = ctx.request.headers
    .get('Authorization')
    ?.replace('Bearer ', '')
    .trim()

  if (!token) return jsonError('UNAUTHORIZED')

  const res = await attempt(() => ctx.jwt.verify(token))
  if (res.error || !res.data)
    return jsonError('FORBIDDEN', ctx, { error: 'invalid/expired token' })

  const decoded = JSON.parse(decode64((res.data as JwtPayload).data))
  ctx.user = decoded
}
