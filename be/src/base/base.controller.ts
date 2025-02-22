import type * as T from '.'
import {
  isPasswordValid,
  generateAccessToken,
  generateToken,
  getRefreshTokenFromRedis,
  verifyJwtRefresh,
} from '@/utils/auth.util'
import { attempt, getUnixTimestamp, paginate, transformBody } from '@/utils/helper.util'
import { jsonOk, jsonError, jsonErrorLogin } from '@/base/base.api'
import { BaseQuery } from '@/base/base.query'

const listData = async (ctx: any, query: BaseQuery) => {
  const { pageNum, perPage } = ctx.query as T.ReqPagination
  const [skip, take] = paginate(pageNum, perPage)
  const totalRecords = await query.count()
  const totalPages = Math.ceil(totalRecords / take)
  const meta = { pageNum, perPage, totalRecords, totalPages }
  const res = await attempt(() => query.getAll(skip, take))
  return res.error ? jsonError() : jsonOk({ records: res.data, meta })
}

const addData = async (ctx: any, query: BaseQuery, input: any) => {
  const res = await attempt(() => query.create(input))
  return res.error ? jsonError('QUERY', ctx, res.error) : jsonOk(res.data)
}

const editData = async (ctx: any, query: BaseQuery, input: any) => {
  const { uuid } = ctx.params as { uuid: string }
  const res = await attempt(() => query.update(uuid, input))
  return res.error ? jsonError('QUERY', ctx, res.error) : jsonOk(res.data)
}

const wipeData = async (ctx: any, query: BaseQuery) => {
  const { uuid } = ctx.params as { uuid: string }
  const modifiedBy = ctx.user.internalId
  const res = await attempt(() => query.softDelete(uuid, { modifiedBy }))
  return res.error ? jsonError('QUERY', ctx, res.error) : jsonOk()
}

const loginUserValidate = async (query: BaseQuery, email: string, password: string) => {
  const res = await attempt(() => query.getPasswordByEmail(email))
  if (res.error || res.data == null) return { error: jsonErrorLogin({ error: 'email not found' }) }

  if (!(await isPasswordValid(password, res.data.password)))
    return { user: null, error: jsonErrorLogin({ error: 'invalid password' }) }

  return { user: res.data, error: null }
}

const loginUser = async (ctx: any, query: BaseQuery) => {
  const { email, password } = transformBody(ctx.body) as T.ReqLogin

  const { user, error } = await loginUserValidate(query, email, password)
  if (error) return error

  const jwtData: T.JwtData = {
    uuid: user.uuid,
    internalId: user.internalId,
    iat: getUnixTimestamp(),
  }

  const { accessToken, refreshToken } = await generateToken(jwtData)
  return jsonOk({ accessToken, refreshToken })
}

const refreshAccToken = async (ctx: any) => {
  const { refreshToken } = transformBody(ctx.body) as {
    refreshToken: string
  }

  const res = await attempt(() => verifyJwtRefresh(refreshToken))
  if (res.error || !res.data) return jsonError('FORBIDDEN', ctx, { error: 'invalid/expired token' })

  const { uuid } = res.data.payload as T.JwtData

  // Fetch refresh token from Redis
  const resStoredToken = await attempt(() => getRefreshTokenFromRedis(uuid))
  if (resStoredToken.error) return jsonError('UNAUTHORIZED', ctx, resStoredToken.error)

  if (resStoredToken.data !== refreshToken)
    return jsonError('UNAUTHORIZED', ctx, {
      error: 'unmatched refresh token',
    })

  // Generate new access token
  const newAccessToken = await generateAccessToken(res.data.payload as T.JwtData)
  return jsonOk({ accessToken: newAccessToken })
}

export { listData, addData, editData, wipeData, loginUser, refreshAccToken }
