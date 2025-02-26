import { t } from 'elysia'

const citizenIdLength = 16
const minName = 3
const maxName = 50
const minPassword = 8
const maxPassword = 32
const minPhone = 10
const maxPhone = 15
const formatPhone = '^\\+?[1-9]\\d{1,14}$'
const formatMediumPassword = '^(?=.*[a-z])(?=.*\\d).{8,}$'
const formatStrongPassword = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'

export const citizenIdRule = () =>
  t.String({
    minLength: citizenIdLength,
    maxLength: citizenIdLength,
    error: {
      message: `[citizen_id] must ${citizenIdLength} characters`,
    },
  })

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

export const genderRule = (type: any) =>
  t.Enum(type, {
    error: { message: '[gender] invalid value' },
  })

export const phoneRule = () =>
  t.String({
    pattern: formatPhone,
    minLength: minPhone,
    maxLength: maxPhone,
    error: { message: '[phone] invalid format' },
  })

export const nationalityRule = () =>
  t.String({
    minLength: minName,
    maxLength: maxName,
    error: {
      message: `[nationality] must be between ${minName} and ${maxName} characters`,
    },
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
      message: '[password] must at least 8 chars, 1 uppercase, number & special chars',
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

export const religionRule = (type: any) =>
  t.Enum(type, {
    error: { message: '[religion] invalid value' },
  })

export const refreshToken = {
  body: t.Object({
    refresh_token: t.String({
      error: {
        message: '[refresh_token] must be provided',
      },
    }),
  }),
}
