import { PrismaClient } from '@prisma/client'
import cfg from '@/config'

export const prismaWrite = new PrismaClient({
  ...cfg.PRISMA_OPT,
  datasources: { db: { url: cfg.RDB_MASTER_URL } },
})

export const prismaRead = new PrismaClient({
  ...cfg.PRISMA_OPT,
  datasources: { db: { url: cfg.RDB_REPLICA_URL } },
})

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

  create = async (data: any) =>
    this.tblWrite.create({ data, ...this.selectField(this.visibleFields) })

  getById = async (id: number) =>
    this.tblRead.findFirst({
      ...this.selectField(this.visibleFields),
      where: {
        id,
        deletedAt: null,
      },
    })

  getByInternalId = async (internalId: number) =>
    this.tblRead.findFirst({
      ...this.selectField(this.visibleFields),
      where: {
        internalId,
        deletedAt: null,
      },
    })

  getAll = async (skip: number, take: number) =>
    this.tblRead.findMany({
      ...this.selectField(this.visibleFields),
      where: {
        deletedAt: null,
      },
      skip,
      take,
    })

  update = async (id: number, data: any) =>
    this.tblWrite.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

  updateByInternalId = async (internalId: number, data: any) =>
    this.tblWrite.update({
      where: { internalId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

  softDeleteById = async (id: number, data: any) => {
    const dateNow = new Date()
    return this.tblWrite.update({
      where: { id },
      data: {
        ...data,
        updatedAt: dateNow,
        deletedAt: dateNow,
      },
    })
  }

  softDeleteByInternalId = async (internalId: number, data: any) => {
    const dateNow = new Date()
    return this.tblWrite.update({
      where: { internalId },
      data: {
        ...data,
        updatedAt: dateNow,
        deletedAt: dateNow,
      },
    })
  }
}
