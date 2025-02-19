import { t } from 'elysia'
import cfg from '@/config'

const minName = cfg.VALIDATION.MIN_NAME
const maxName = cfg.VALIDATION.MAX_NAME
const minPassword = cfg.VALIDATION.MIN_PASSWORD
const maxPassword = cfg.VALIDATION.MAX_PASSWORD
const minPhone = cfg.VALIDATION.MIN_PHONE
const maxPhone = cfg.VALIDATION.MAX_PHONE
const formatPhone = cfg.VALIDATION.REGEX_FORMAT_PHONE
const formatStrongPassword = cfg.VALIDATION.REGEX_FORMAT_STRONG_PASSWORD
const formatMediumPassword = cfg.VALIDATION.REGEX_FORMAT_MEDIUM_PASSWORD

export const fullnameRule = () =>
  t.String({
    minLength: minName,
    maxLength: maxName,
    error: {
      message: `[fullname] must be between ${minName} and ${maxName} characters`,
    },
  })

export const nicknameRule = () =>
  t.String({
    minLength: minName,
    maxLength: maxName,
    error: {
      message: `[nickname] must be between ${minName} and ${maxName} characters`,
    },
  })

export const emailRule = () =>
  t.String({
    format: 'email',
    error: { message: '[email] invalid format' },
  })

export const phoneRule = () =>
  t.String({
    pattern: formatPhone,
    minLength: minPhone,
    maxLength: maxPhone,
    error: { message: '[phone] invalid format' },
  })

export const statusRule = (status: any) =>
  t.Enum(status, {
    error: { message: '[status] invalid value' },
  })

export const strongPasswordRule = () =>
  t.String({
    minLength: minPassword,
    maxLength: maxPassword,
    pattern: formatStrongPassword,
    error: {
      message:
        '[password] must at least 8 chars, 1 uppercase, number & special chars',
    },
  })

export const mediumPasswordRule = () =>
  t.String({
    minLength: minPassword,
    maxLength: maxPassword,
    pattern: formatMediumPassword,
    error: {
      message: '[password] must at least 8 chars and 1 number',
    },
  })
