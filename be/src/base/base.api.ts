import type { ErrorMap } from '.'
import { transformKeysToSnakeCase } from '@/utils/helper.util'
import { log } from '@/packages'

const headers = { 'Content-Type': 'application/json' }

// errorMap key should unique & don't contain name of each key
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

const findErrorMap = (code: string) => {
  const foundKey = Object.keys(errorMap).find((key) => code.toUpperCase().includes(key))

  return foundKey ? errorMap[foundKey] : { status: 500, message: 'Unknown error' }
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
  }

  // Check suffix '_MASK' to not exposing real log
  dataLog = data
  if (!code.includes('_SHOW')) {
    data = null
  }

  return { errors, dataLog, dataProcessed: data }
}

const jsonOk = (data?: any, message: string = 'success', status = 200) =>
  new Response(JSON.stringify(transformKeysToSnakeCase({ success: true, message, data })), {
    status,
    headers,
  })

const jsonError = (code: string = 'INTERNAL', ctx?: any, data?: any, note?: string) => {
  const { status, message } = findErrorMap(code)
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

const jsonErrorLogin = (data: any) => jsonError('INTERNAL', null, data)

export { jsonOk, jsonError, jsonErrorLogin }
