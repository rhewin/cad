import { attempt, generateUUID7, transformBody } from '@/utils/helper.util'
import { hashPassword } from '@/utils/auth.util'
import { jsonOk, jsonError } from '@/base/base.api'
import { memberQuery } from './member.query'
import { listData, editData, wipeData, loginUser } from '@/base/base.controller'
import type * as T from './member.types'

const login = async (ctx: any) => loginUser(ctx, memberQuery)
const list = async (ctx: any) => listData(ctx, memberQuery)
const wipe = async (ctx: any) => wipeData(ctx, memberQuery)

const edit = async (ctx: any) =>
  editData(ctx, memberQuery, {
    ...(transformBody(ctx.body) as T.ReqUpdateMember),
    modifiedBy: ctx.user.internalId,
  })

const add = async (ctx: any) => {
  const req = transformBody(ctx.body) as T.ReqCreateMember

  if (!req.email && !req.phone) {
    return jsonError('BAD_REQUEST', ctx, null, 'Either email or phone must be provided')
  }

  const input = {
    ...req,
    uuid: generateUUID7(),
    internalId: await memberQuery.generateInternalId(),
    password: await hashPassword(req.password),
    modifiedBy: ctx.user.internalId,
  }
  const res = await attempt(() => memberQuery.createNested(input))
  return res.error ? jsonError('QUERY', ctx, res.error) : jsonOk(res.data)
}

export default {
  list,
  add,
  edit,
  wipe,
  login,
}
