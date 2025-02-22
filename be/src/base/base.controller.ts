import type * as T from '.'
import type { JwtPayload } from '@/base/index'
import { isPasswordValid, generateToken, getRefreshToken, saveRefreshToken } from '@/utils/auth.util'
import { attempt, decode64, encode64, getUnixTimestamp, paginate, transformBody } from '@/utils/helper.util'
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

  const jwtData = {
    uuid: user.uuid,
    internalId: user.internalId,
    iat: getUnixTimestamp(),
  }

  const { accessToken, refreshToken } = await generateToken(jwtData)

  // const encodedJwtData = encode64(JSON.stringify(jwtData))
  // const resAccessToken = await attempt(() =>
  //   ctx.jwt.sign({ data: encodedJwtData })
  // )
  // if (resAccessToken.error)
  //   return jsonError('INTERNAL', ctx, resAccessToken.error)

  // const resRefreshToken = await attempt(() =>
  //   ctx.jwtrefresh.sign({ data: encodedJwtData })
  // )
  // if (resRefreshToken.error)
  //   return jsonError('INTERNAL', ctx, resRefreshToken.error)

  // const resRedis = await attempt(() =>
  //   saveRefreshToken(user.uuid, resRefreshToken.data as string)
  // )
  // if (resRedis.error) return jsonError('INTERNAL', ctx)

  return jsonOk({ accessToken, refreshToken })
}

const refreshAccToken = async (ctx: any) => {
  const { refreshToken } = transformBody(ctx.body) as {
    refreshToken: string
  }

  const resPayload = await attempt(() => ctx.jwtrefresh.verify(refreshToken))
  if (resPayload.error) return jsonError('UNAUTHORIZED', ctx, { error: 'jwtRefresh.verify' })

  const { uuid } = JSON.parse(decode64((resPayload.data as JwtPayload).data))

  // Fetch refresh token from Redis
  const resStoredToken = await attempt(() => getRefreshToken(uuid))
  if (resStoredToken.error) return jsonError('UNAUTHORIZED', ctx, resStoredToken.error)

  if (resStoredToken.error || resStoredToken.data !== refreshToken)
    return jsonError('UNAUTHORIZED', ctx, {
      error: 'unmatched refresh token',
    })

  // Generate new access token
  const newAccessToken = await ctx.jwt.sign({
    data: (resPayload.data as JwtPayload).data,
  })

  return jsonOk({ accessToken: newAccessToken })
}

export { listData, addData, editData, wipeData, loginUser, refreshAccToken }
