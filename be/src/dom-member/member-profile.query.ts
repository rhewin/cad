import { BaseQuery } from '@/base/base.query'

export class MemberProfileQuery extends BaseQuery {
  constructor() {
    const tableName = 'memberProfile'

    const visibleFields = {
      gender: true,
      nationality: true,
      citizenId: true,
      religion: true,
      verified: true,
    }

    super(tableName, visibleFields)
  }

  detailByMemberUUID = async (memberUuid: number) =>
    this.tblRead.findUnique({
      ...this.selectField(this.visibleFields),
      where: {
        memberUuid,
      },
    })

  updateByMemberUUID = async (memberUuid: string, data: any) =>
    this.tblWrite.update({
      where: {
        memberUuid,
      },
      data: {
        ...data,
      },
    })
}

export const memberProfileQuery = new MemberProfileQuery()
