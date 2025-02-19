export interface ReqCreateMember {
  email?: string
  phone?: string
  password: string
  fullname?: string
  nickname?: string
}

export interface ReqUpdateMember {
  email?: string
  phone?: string
  password?: string
  fullname?: string
  nickname?: string
  status?: string
}
