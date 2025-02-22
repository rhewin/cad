import { log } from '@/packages'

export const loggerMiddleware = async (ctx: any) => {
  const { method, url, headers } = ctx.request || {}

  const allowedHeaders = ['accept', 'authorization', 'cache-control', 'user-agent']

  let filteredHeaders = null
  if (headers) {
    const headersObj = Object.fromEntries(headers.entries())
    filteredHeaders = Object.fromEntries(
      Object.entries(headersObj).filter(([key]) => allowedHeaders.includes(key.toLowerCase()))
    )
  }

  log.info({ headers: filteredHeaders }, `HTTP Request: ${method} ${url}`)
}
