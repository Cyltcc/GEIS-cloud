export interface ApiResponse<T = unknown> {
  code?: number | string
  message?: string
  msg?: string
  data?: T
  [key: string]: unknown
}

export interface PaginationMeta {
  total: number
  count: number
  per_page: number
  current_page: number
  total_pages: number
}

export interface PaginatedResponseData<T> {
  items: T[]
  total: number
  page: number
  per_page: number
}

