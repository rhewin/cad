import { rateLimit } from 'elysia-rate-limit'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { attempt } from '@/utils/helper.util'
import { PrismaClient } from '@prisma/client'
import pino from 'pino'
import Redis from 'ioredis'
import cfg from './config'

const packages = (app: any) => {
  return app
    .use(rateLimit(cfg.RATELIMIT_GLOBAL_OPT))
    .use(cors(cfg.CORS_OPT))
    .use(jwt(cfg.JWT_OPT))
    .use(jwt(cfg.JWT_REFRESH_OPT))
}

const log = pino(cfg.LOGGER_OPT)

const prismaWrite = new PrismaClient({
  ...cfg.PRISMA_OPT,
  datasources: { db: { url: cfg.RDB_MASTER_URL } },
})

const prismaRead = new PrismaClient({
  ...cfg.PRISMA_OPT,
  datasources: { db: { url: cfg.RDB_REPLICA_URL } },
})

const redis = new Redis(cfg.REDIS_URL, {
  showFriendlyErrorStack: false,
  keepAlive: 1000,
  maxRetriesPerRequest: null, // Allows retries
  enableReadyCheck: true, // Ensures Redis is ready
  retryStrategy: (times) => {
    if (times >= 1) return null // Stop reconnecting after 1 failed attempts
    return Math.min(times * 200, 2000) // Exponential backoff (max 2s delay)
  },
}).on('error', (err) => {
  log.error(`❌ Redis failed, server shutdown. Redis URL: ${cfg.REDIS_URL}, err: ${err}`)
})

const checkPrismaConnection = async () => {
  const resWrite = await attempt(() => prismaWrite.$connect())
  if (resWrite.error) {
    log.error(`❌ RDB write failed, server shutdown. URL: ${cfg.RDB_MASTER_URL}`)
    process.exit(1)
  }
  log.info('✅ RDB write connected successfully.')

  const resRead = await attempt(() => prismaRead.$connect())
  if (resRead.error) {
    log.error(`❌ RDB read failed, server shutdown. URL: ${cfg.RDB_REPLICA_URL}`)
    process.exit(1)
  }
  log.info('✅ RDB read connected successfully.')
}

const checkRedisConnection = async () => {
  const res = await attempt(() => redis.ping())
  if (!res.data || res.error) {
    log.error(`❌ Redis failed, server shutdown. Redis URL: ${cfg.REDIS_URL}`)
  }
  log.info('✅ Redis is running.')
}

export { packages, log, prismaWrite, prismaRead, redis, checkPrismaConnection, checkRedisConnection }
