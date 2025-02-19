import type { ErrorMap } from '.'
import { transformKeysToSnakeCase } from '@/utils/helper.util'
import { log } from '@/packages'

const headers = { 'Content-Type': 'application/json' }

const errorMap: Record<string, ErrorMap> = {
  VALIDATION: { status: 400, message: 'Validation failed' },
  BAD_REQUEST: { status: 400, message: 'Bad request' },
  UNAUTHORIZED: { status: 401, message: 'Unauthorized access' },
  FORBIDDEN: { status: 403, message: 'Forbidden' },
  NOT_FOUND: { status: 404, message: 'Route not found' },
  TOO_MANY_REQUESTS: { status: 429, message: 'Too many requests' },
  QUERY: { status: 500, message: 'Bad query' },
  INTERNAL: { status: 500, message: 'Internal server error' },
}

const parseContext = (ctx?: any) => {
  if (!ctx) return undefined
  return {
    user_id: ctx.user?.internalId,
    body: ctx.body,
    params: ctx.params,
    query: ctx.query,
    url: ctx.url,
  }
}

const processErrors = (code: string, ctx?: any, data?: any) => {
  let errors: string[] | undefined
  let dataLog: any

  if (code === 'VALIDATION' && Array.isArray(ctx)) {
    errors = [...new Set(ctx.map((e: any) => e.schema.error.message))]
  } else if (
    code === 'QUERY' &&
    data?.name === 'PrismaClientKnownRequestError'
  ) {
    dataLog = data
    data = null
  }
  return { errors, dataLog, dataProcessed: data }
}

const jsonOk = (data?: any, message: string = 'success', status = 200) =>
  new Response(
    JSON.stringify(transformKeysToSnakeCase({ success: true, message, data })),
    {
      status,
      headers,
    }
  )

const jsonError = (
  code: string = 'INTERNAL',
  ctx?: any,
  data?: any,
  note?: string
) => {
  const { status, message } = errorMap[code] || {
    status: 500,
    message: 'Unknown error',
  }
  const context = parseContext(ctx)
  let { errors, dataLog, dataProcessed } = processErrors(code, ctx, data)

  log.error({ ...dataLog, context, errors }, message)

  return new Response(
    JSON.stringify(
      transformKeysToSnakeCase({
        success: false,
        message: note ?? message,
        data: { ...dataProcessed, ...(errors && { errors }) },
      })
    ),
    { status, headers }
  )
}

const jsonErrorLogin = () => jsonError('INTERNAL', null, null, 'Login failed')

export { jsonOk, jsonError, jsonErrorLogin }
