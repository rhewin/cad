import type * as T from './admin.types'
import { generateUUID7, transformBody } from '@/utils/helper.util'
import { hashPassword } from '@/utils/auth.util'
import { adminQuery } from './admin.query'
import {
  listData,
  addData,
  editData,
  wipeData,
  loginUser,
} from '@/base/base.controller'

const login = async (ctx: any) => loginUser(ctx, adminQuery)
const list = async (ctx: any) => listData(ctx, adminQuery)
const wipe = async (ctx: any) => wipeData(ctx, adminQuery)

const add = async (ctx: any) => {
  const req = transformBody(ctx.body) as T.ReqCreateAdmin

  return addData(ctx, adminQuery, {
    ...req,
    uuid: generateUUID7(),
    internalId: await adminQuery.generateInternalId(),
    password: await hashPassword(req.password),
    modifiedBy: ctx.user.internalId,
  })
}

const edit = async (ctx: any) =>
  editData(ctx, adminQuery, {
    ...(transformBody(ctx.body) as T.ReqUpdateAdmin),
    modifiedBy: ctx.user.internalId,
  })

export default {
  list,
  add,
  edit,
  wipe,
  login,
}
