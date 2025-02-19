const isProduction = process.env.NODE_ENV === 'production'

const CORS_OPT = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}

const JWT_OPT = {
  name: 'jwt',
  secret: process.env.JWT_SECRET ?? 'bXlqd3RzZWNyZXQ=',
}

const LOGGER_OPT = {
  level: isProduction ? 'error' : 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid',
    },
  },
}

const PRISMA_OPT = {
  errorFormat: 'minimal' as 'pretty' | 'colorless' | 'minimal',
  log: ['query', 'warn'] as any,
}

const RATELIMIT_GLOBAL_OPT = {
  max: 100, // 100 requests
  timeWindow: 60 * 1000, // per 60 seconds
  message: 'Too many requests. Please try again later.',
}

const RATELIMIT_LOGIN_OPT = {
  max: 5, // 5 requests
  timeWindow: 60 * 1000, // per 60 seconds
  message: 'Too many requests. Please try again later.',
}

const RATELIMIT_GUARD_OPT = {
  max: 50, // 50 requests
  timeWindow: 60 * 1000, // per 60 seconds
  message: 'Too many requests. Please try again later.',
}

const SWAGGER_OPT = {
  defaultTag: undefined,
  info: {
    title: process.env.APP_NAME ?? '',
    version: '1.0.0',
    description: process.env.APP_DESCRIPTION ?? '',
    contact: {
      name: 'Rheza Sindhuwinata',
      email: 'rheza.s@gmail.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
}

export default {
  APP_NAME: process.env.APP_NAME ?? '',
  APP_DESCRIPTION: process.env.APP_DESCRIPTION ?? '',
  APP_PORT: Number(process.env.APP_PORT) || 3000,
  CHARS_PIN: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  CORS_OPT,
  JWT_OPT,
  LOGGER_OPT,
  PRISMA_OPT,
  SWAGGER_OPT,
  HASH_ARGON: {
    algorithm: 'argon2id' as 'argon2id' | 'argon2i' | 'argon2d',
    memoryCost: 4,
    timeCost: 3,
  },
  PAGINATION: {
    DEFAULT_PER_PAGE: 10,
  },
  RATELIMIT_GLOBAL_OPT,
  RATELIMIT_LOGIN_OPT,
  RATELIMIT_GUARD_OPT,
  RDB_MASTER_URL: process.env.RDB_MASTER_URL,
  RDB_REPLICA_URL: process.env.RDB_REPLICA_URL,
  VALIDATION: {
    MIN_NAME: 3,
    MAX_NAME: 50,
    MIN_PASSWORD: 8,
    MAX_PASSWORD: 32,
    MIN_PHONE: 10,
    MAX_PHONE: 15,
    REGEX_FORMAT_PHONE: '^\\+?[1-9]\\d{1,14}$',
    REGEX_FORMAT_MEDIUM_PASSWORD: '^(?=.*[a-z])(?=.*\\d).{8,}$',
    REGEX_FORMAT_STRONG_PASSWORD:
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
  },
}
