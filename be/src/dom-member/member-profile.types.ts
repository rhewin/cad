export interface ReqCreateMemberProfile {
  gender?: string
  nationality?: string
  citizenId?: string
  religion?: string
}

export interface ReqUpdateMemberProfile {
  gender?: string
  nationality?: string
  citizenId?: string
  religion?: string
  verified?: boolean
}
