import type * as T from '@/base'
import cfg from '@/config'
import { attempt } from '@/utils/helper.util'
import { compactDecrypt, EncryptJWT, jwtVerify, SignJWT } from 'jose'
import { createSecretKey } from 'crypto'
import { log, redis } from '@/packages'

const accessSecret = createSecretKey(Buffer.from(cfg.JWT_OPT.secret, 'base64'))
const refreshSecret = createSecretKey(Buffer.from(cfg.JWT_REFRESH_OPT.secret, 'base64'))
const jweSecret = createSecretKey(Buffer.from(cfg.JWE_SECRET, 'base64'))

const hashPassword = async (password: string) => await globalThis.Bun.password.hash(password, cfg.HASH_ARGON)

const isPasswordValid = async (pass: string, hashedPass: string) =>
  await globalThis.Bun.password.verify(pass, hashedPass)

const encryptJwt = async (token: string, exp: string) =>
  await new EncryptJWT({ token })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .encrypt(jweSecret)

const decryptJwt = async (encryptedToken: string) => {
  const res = await attempt(async () => {
    const { plaintext } = await compactDecrypt(encryptedToken, jweSecret)
    return new TextDecoder().decode(plaintext)
  })

  return res.error ? null : res.data
}

const generateAccessToken = async (data: T.JwtData) => {
  const accessToken = await new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(cfg.JWT_OPT.exp)
    .sign(accessSecret)

  return await encryptJwt(accessToken, cfg.JWT_OPT.exp)
}

const generateRefreshToken = async (data: T.JwtData) => {
  const refreshToken = await new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(cfg.JWT_REFRESH_OPT.exp)
    .sign(refreshSecret)

  const encryptedToken = await encryptJwt(refreshToken, cfg.JWT_REFRESH_OPT.exp)

  const resRedis = await attempt(() => saveRefreshTokenToRedis(data.uuid, encryptedToken))
  if (resRedis.error) return ''

  return encryptedToken
}

const generateToken = async (data: T.JwtData) => {
  const accessToken = await generateAccessToken(data)
  const refreshToken = await generateRefreshToken(data)
  return { accessToken, refreshToken }
}

const verifyJwt = async (encryptedToken: string) => {
  const decryptedJwt = await decryptJwt(encryptedToken)
  if (!decryptedJwt) return null

  log.info(`decrypted jwt: ${decryptedJwt}`)

  const decryptedToken = JSON.parse(decryptedJwt || '') as T.JwtPayload
  const res = await attempt(() => jwtVerify(decryptedToken.token, accessSecret))
  return res.error ? null : res.data
}

const verifyJwtRefresh = async (encryptedToken: string) => {
  const decryptedJwt = await decryptJwt(encryptedToken)
  if (!decryptedJwt) return null

  log.info(`decrypted jwt: ${decryptedJwt}`)

  const decryptedToken = JSON.parse(decryptedJwt || '') as T.JwtPayload
  const res = await attempt(() => jwtVerify(decryptedToken.token, refreshSecret))
  return res.error ? null : res.data
}

const saveRefreshTokenToRedis = async (uuid: string, token: string) => {
  const expired = cfg.REDIS_REFRESH_TOKEN_EXP
  const key = `refresh:${uuid}`
  return await redis.set(key, token, 'EX', expired)
}

const getRefreshTokenFromRedis = async (uuid: string) => {
  const key = `refresh:${uuid}`
  return await redis.get(key)
}

export {
  hashPassword,
  isPasswordValid,
  generateAccessToken,
  generateToken,
  getRefreshTokenFromRedis,
  verifyJwt,
  verifyJwtRefresh,
}
