import type * as T from '.'
import { isPasswordValid } from '@/utils/auth.util'
import {
  attempt,
  encode64,
  getUnixTimestamp,
  paginate,
} from '@/utils/helper.util'
import { jsonOk, jsonError, jsonErrorLogin } from '@/base/base.api'
import { BaseQuery } from '@/base/base.query'

const listData = async (ctx: any, query: BaseQuery) => {
  const { pageNum, perPage } = ctx.query as T.ReqPagination
  const [skip, take] = paginate(pageNum, perPage)
  const totalRecords = await query.count()
  const totalPages = Math.ceil(totalRecords / take)
  const meta = { pageNum, perPage, totalRecords, totalPages }
  const [data, err] = await attempt(() => query.getAll(skip, take))
  return err ? jsonError() : jsonOk({ records: data, meta })
}

const addData = async (ctx: any, query: BaseQuery, input: any) => {
  const [data, err] = await attempt(() => query.create(input))
  return err ? jsonError('QUERY', ctx, err) : jsonOk(data)
}

const editData = async (ctx: any, query: BaseQuery, input: any) => {
  const { uuid } = ctx.params as { uuid: string }
  const [data, err] = await attempt(() => query.update(uuid, input))
  return err ? jsonError('QUERY', ctx, err) : jsonOk(data)
}

const wipeData = async (ctx: any, query: BaseQuery) => {
  const { uuid } = ctx.params as { uuid: string }
  const modifiedBy = ctx.user.internalId
  const [, err] = await attempt(() => query.softDelete(uuid, { modifiedBy }))
  return err ? jsonError('QUERY', ctx, err) : jsonOk()
}

const loginUser = async (ctx: any, query: BaseQuery) => {
  const { email, password } = ctx.body as T.ReqLogin

  const [user, errUser] = await attempt(() => query.getPasswordByEmail(email))

  if (errUser || user == null) return jsonErrorLogin()

  if (!(await isPasswordValid(password, user.password))) return jsonError()

  const jwtData = {
    uuid: user.uuid,
    internalId: user.internalId,
    iat: getUnixTimestamp(),
  }
  const encodedJwtData = encode64(JSON.stringify(jwtData))
  const [sign, errSign] = await attempt(() =>
    ctx.jwt.sign({ data: encodedJwtData })
  )
  return errSign ? jsonError() : jsonOk(sign)
}

export { listData, addData, editData, wipeData, loginUser }
