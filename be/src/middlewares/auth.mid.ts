import { attempt } from '@/utils/helper.util'
import { verifyJwt } from '@/utils/auth.util'
import { jsonError } from '@/base/base.api'

export const authMiddleware = async (ctx: any) => {
  const token = ctx.request.headers.get('Authorization')?.replace('Bearer ', '').trim()
  if (!token) return jsonError('UNAUTHORIZED')

  const res = await attempt(() => verifyJwt(token))
  if (res.error || !res.data) return jsonError('FORBIDDEN', ctx, { error: 'invalid/expired token' })

  ctx.user = res.data.payload
}
