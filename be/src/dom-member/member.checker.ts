import { t } from 'elysia'
import * as validator from '@/base/base.checker'

const memberStatus = {
  active: 'active',
  inactive: 'inactive',
  onreview: 'onreview',
}

const add = {
  body: t.Object({
    email: t.Optional(validator.emailRule()),
    phone: t.Optional(validator.phoneRule()),
    password: validator.mediumPasswordRule(),
    fullname: t.Optional(validator.fullnameRule()),
    nickname: t.Optional(validator.nicknameRule()),
  }),
}

const edit = {
  body: t.Object({
    email: t.Optional(validator.emailRule()),
    phone: t.Optional(validator.phoneRule()),
    fullname: t.Optional(validator.fullnameRule()),
    nickname: t.Optional(validator.nicknameRule()),
    status: t.Optional(validator.statusRule(memberStatus)),
  }),
}

const login = {
  body: t.Object({
    email: validator.emailRule(),
    password: validator.mediumPasswordRule(),
  }),
}

export default {
  add,
  edit,
  login,
}
