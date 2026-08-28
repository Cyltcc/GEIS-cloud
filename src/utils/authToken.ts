import type { AuthTokenData } from '@/types/auth'

type UnknownRecord = Record<string, unknown>

const DEFAULT_EXPIRES_SECONDS = 7200

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null

const readString = (obj: UnknownRecord, keys: string[]): string => {
  for (const key of keys) {
    const value = obj[key]
    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }

  return ''
}

const readNumber = (obj: UnknownRecord, keys: string[]): number => {
  for (const key of keys) {
    const value = obj[key]
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }
    if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value)
    }
  }

  return 0
}

export const unwrapResponseData = (payload: unknown): UnknownRecord => {
  if (!isRecord(payload)) {
    return {}
  }

  const innerData = payload.data
  if (isRecord(innerData)) {
    return innerData
  }

  return payload
}

export const normalizeAuthToken = (payload: unknown): AuthTokenData => {
  const data = unwrapResponseData(payload)
  const accessToken = readString(data, ['accessToken', 'access_token', 'token'])
  const refreshToken = readString(data, ['refreshToken', 'refresh_token'])
  const expires = readNumber(data, ['expires', 'expires_in', 'expire', 'expiresAt', 'expires_at'])

  return {
    accessToken,
    refreshToken,
    expires: expires > 0 ? expires : DEFAULT_EXPIRES_SECONDS,
  }
}

