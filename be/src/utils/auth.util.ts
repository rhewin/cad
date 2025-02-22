import cfg from '@/config'
import { SignJWT, EncryptJWT } from 'jose'
import { redis } from '@/packages'

const accessSecret = Buffer.from(cfg.JWT_OPT.secret, 'base64')
const refreshSecret = Buffer.from(cfg.JWT_REFRESH_OPT.secret, 'base64')
const jweSecret = Buffer.from(cfg.JWE_SECRET, 'base64')

const hashPassword = async (password: string) => await globalThis.Bun.password.hash(password, cfg.HASH_ARGON)

const isPasswordValid = async (pass: string, hashedPass: string) =>
  await globalThis.Bun.password.verify(pass, hashedPass)

const generateAccessToken = async (data: any) => {
  const accessToken = await new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(cfg.JWT_OPT.exp)
    .sign(accessSecret)

  return await new EncryptJWT({ token: accessToken })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(cfg.JWT_OPT.exp)
    .encrypt(jweSecret)
}

const generateRefreshToken = async (data: any) => {
  const refreshToken = await new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(cfg.JWT_REFRESH_OPT.exp)
    .sign(refreshSecret)

  return await new EncryptJWT({ token: refreshToken })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(cfg.JWT_REFRESH_OPT.exp)
    .encrypt(jweSecret)
}

const generateToken = async (data: any) => {
  const accessToken = generateAccessToken(data)
  const refreshToken = generateRefreshToken(data)

  return { accessToken, refreshToken }
}

const saveRefreshToken = async (uuid: string, token: string) => {
  const expired = cfg.REDIS_REFRESH_TOKEN_EXP
  const key = `refresh:${uuid}`
  return await redis.set(key, token, 'EX', expired)
}

const getRefreshToken = async (uuid: string) => {
  const key = `refresh:${uuid}`
  return await redis.get(key)
}

export { hashPassword, isPasswordValid, generateToken, getRefreshToken, saveRefreshToken }
