export interface ErrorMap {
  status: number
  message: string
}

export interface JwtPayload {
  token: string
  iat: number
  exp: number
}

export interface JwtData {
  uuid: string
  internalId: string
  iat: number
  [key: string]: unknown // Allows arbitrary keys that required by JOSE JWTPayload compatibility
}

export interface ReqPagination {
  pageNum?: number
  perPage?: number
}

export interface ReqLogin {
  email: string
  password: string
}
