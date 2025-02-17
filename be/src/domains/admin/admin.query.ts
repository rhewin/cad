import { BaseQuery } from '@/base/query.base'
import { generatePIN } from '@/utils/helper.util'

export class AdminQuery extends BaseQuery {
  constructor() {
    const tableName = 'admin'

    const visibleFields = {
      uuid: true,
      internalId: true,
      email: true,
      fullname: true,
      nickname: true,
      createdAt: true,
    }

    super(tableName, visibleFields)
  }

  getPasswordByEmail = async (email: string) => {
    return this.tblRead.findFirst({
      select: {
        uuid: true,
        internalId: true,
        password: true,
      },
      where: {
        email,
        deletedAt: null,
      },
    })
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
      exists = !!(await this.findByInternalId(`A${pin}`))
    } while (exists)

    return `A${pin}`
  }
}

export const adminQuery = new AdminQuery()
