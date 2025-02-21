import cfg from '@/config'
import { redis } from '@/packages'

const hashPassword = async (password: string) =>
  await globalThis.Bun.password.hash(password, cfg.HASH_ARGON)

const isPasswordValid = async (pass: string, hashedPass: string) =>
  await globalThis.Bun.password.verify(pass, hashedPass)

const saveRefreshToken = async (uuid: string, token: string) => {
  const expired = cfg.REDIS_REFRESH_TOKEN_EXP
  const key = `refresh:${uuid}`
  return await redis.set(key, token, 'EX', expired)
}

const getRefreshToken = async (uuid: string) => {
  const key = `refresh:${uuid}`
  return await redis.get(key)
}

export { hashPassword, isPasswordValid, getRefreshToken, saveRefreshToken }
