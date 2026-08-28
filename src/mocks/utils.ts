import type { ApiResponse, PaginatedResponseData, PaginationMeta } from '@/types/api'

const DEFAULT_DELAY = 160

export const mockDelay = <T>(value: T, delay = DEFAULT_DELAY): Promise<T> => {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), delay)
  })
}

export const mockOk = <T>(data: T, message = 'ok'): ApiResponse<T> => ({
  code: 200,
  message,
  data,
})

export const mockFail = <T = never>(
  message: string,
  code: number | string = 400
): ApiResponse<T> => ({
  code,
  message,
})

export const getPageNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

export const paginate = <T>(
  items: T[],
  pageValue: unknown,
  pageSizeValue: unknown
): PaginatedResponseData<T> & { meta: { pagination: PaginationMeta } } => {
  const page = getPageNumber(pageValue, 1)
  const perPage = getPageNumber(pageSizeValue, 10)
  const start = (page - 1) * perPage
  const pageItems = items.slice(start, start + perPage)
  const totalPages = Math.max(1, Math.ceil(items.length / perPage))

  return {
    items: pageItems,
    total: items.length,
    page,
    per_page: perPage,
    meta: {
      pagination: {
        total: items.length,
        count: pageItems.length,
        per_page: perPage,
        current_page: page,
        total_pages: totalPages,
      },
    },
  }
}
