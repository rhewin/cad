import { t } from 'elysia'
import * as validator from '@/base/base.checker'

const adminStatus = {
  active: 'active',
  inactive: 'inactive',
}

const add = {
  body: t.Object({
    email: validator.emailRule(),
    password: validator.strongPasswordRule(),
    fullname: validator.fullnameRule(),
    nickname: validator.nicknameRule(),
  }),
}

const edit = {
  body: t.Object({
    email: t.Optional(validator.emailRule()),
    fullname: t.Optional(validator.fullnameRule()),
    nickname: t.Optional(validator.nicknameRule()),
    status: t.Optional(validator.statusRule(adminStatus)),
  }),
}

const login = {
  body: t.Object({
    email: validator.emailRule(),
    password: validator.strongPasswordRule(),
  }),
}

export default {
  add,
  edit,
  login,
}
