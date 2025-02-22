import { prismaRead, prismaWrite } from '@/packages'

export class BaseQuery {
  protected readonly tblRead
  protected readonly tblWrite
  protected readonly visibleFields

  constructor(tableName: string, visibleFields: any) {
    this.tblRead = (prismaRead as any)[tableName]
    this.tblWrite = (prismaWrite as any)[tableName]
    this.visibleFields = visibleFields
  }

  selectField = (fields: any) => (!fields ? {} : { select: fields })

  count = async () => this.tblRead.count({ where: { deletedAt: null } })

  create = async (data: any) => this.tblWrite.create({ data, ...this.selectField(this.visibleFields) })

  getAll = async (skip: number, take: number) =>
    this.tblRead.findMany({
      ...this.selectField(this.visibleFields),
      where: {
        deletedAt: null,
      },
      skip,
      take,
    })

  getById = async (uuid: string) =>
    this.tblRead.findFirst({
      ...this.selectField(this.visibleFields),
      where: {
        uuid,
        deletedAt: null,
      },
    })

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

  update = async (uuid: string, data: any) =>
    this.tblWrite.update({
      where: {
        uuid,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

  softDelete = async (uuid: string, data: any) => {
    const dateNow = new Date()
    return this.tblWrite.update({
      where: {
        uuid,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedAt: dateNow,
        deletedAt: dateNow,
      },
    })
  }
}
