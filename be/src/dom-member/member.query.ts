import { BaseQuery } from '@/base/base.query'
import { generatePIN } from '@/utils/helper.util'

export class MemberQuery extends BaseQuery {
  constructor() {
    const tableName = 'member'

    const visibleFields = {
      internalId: true,
      fullname: true,
      nickname: true,
      email: true,
      phone: true,
      status: true,
      createdAt: true,
    }

    super(tableName, visibleFields)
  }

  findByInternalId = async (internalId: string) =>
    this.tblRead.findUnique({
      select: {
        id: true,
      },
      where: {
        internalId,
      },
    })

  generateInternalId = async (): Promise<string> => {
    let pin: string
    let exists: boolean
    do {
      pin = generatePIN()
      exists = !!(await this.findByInternalId(`M${pin}`))
    } while (exists)

    return `M${pin}`
  }

  createNested = async (data: any) =>
    this.tblWrite.create({
      data: { ...data, memberProfile: { create: {} } },
      ...this.selectField(this.visibleFields),
    })
}

export const memberQuery = new MemberQuery()
