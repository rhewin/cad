import type * as T from './member-profile.types'
import { attempt, transformBody } from '@/utils/helper.util'
import { jsonOk, jsonError } from '@/base/base.api'
import { memberProfileQuery } from './member-profile.query'

const detail = async (ctx: any) => {
  const res = await attempt(() => memberProfileQuery.detailByMemberUUID(ctx.params.uuid))
  return res.error ? jsonError() : jsonOk(res.data)
}

const edit = async (ctx: any) => {
  const { uuid } = ctx.params as { uuid: string }
  const res = await attempt(() =>
    memberProfileQuery.updateByMemberUUID(uuid, { ...(transformBody(ctx.body) as T.ReqUpdateMemberProfile) })
  )
  return res.error ? jsonError('QUERY', ctx, res.error) : jsonOk(res.data)
}

export default {
  detail,
  edit,
}
