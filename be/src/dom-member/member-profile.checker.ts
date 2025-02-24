import { t } from 'elysia'
import * as validator from '@/base/base.checker'

const genderType = {
  male: 'male',
  female: 'female',
}

const religionType = {
  catholic: 'catholic',
  christianity: 'christianity',
  hindu: 'hindu',
  islam: 'islam',
  buddhism: 'buddhism',
}

const edit = {
  body: t.Object({
    gender: t.Optional(validator.genderRule(genderType)),
    nationality: t.Optional(validator.nationalityRule()),
    citizenId: t.Optional(validator.citizenIdRule()),
    religion: t.Optional(validator.religionRule(religionType)),
    verified: t.Optional(t.Boolean()),
  }),
}

export default { edit }
