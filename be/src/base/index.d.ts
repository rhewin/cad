export interface ErrorMap {
  status: number
  message: string
}

export interface JwtPayload {
  data: string
}

export interface ReqPagination {
  pageNum?: number
  perPage?: number
}

export interface ReqLogin {
  email: string
  password: string
}
