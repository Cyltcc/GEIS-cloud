import type { ApiResponse } from '@/types/api'
import type { AuthTokenData, LoginData } from '@/types/auth'
import { mockDelay, mockFail, mockOk } from './utils'

const TOKEN_EXPIRES_SECONDS = 7200

const createToken = (username: string): AuthTokenData => {
  const issuedAt = Date.now()
  const normalizedUsername = username.trim() || 'mock-user'

  return {
    accessToken: `mock-access-token.${normalizedUsername}.${issuedAt}`,
    refreshToken: `mock-refresh-token.${normalizedUsername}.${issuedAt}`,
    expires: TOKEN_EXPIRES_SECONDS,
  }
}

export const mockLogin = (data: LoginData): Promise<ApiResponse<AuthTokenData>> => {
  if (!data.username.trim() || !data.password.trim()) {
    return mockDelay(mockFail('请输入用户名和密码'))
  }

  return mockDelay(mockOk(createToken(data.username), '登录成功'))
}

export const mockRefreshToken = (
  payload: Record<string, unknown>
): Promise<ApiResponse<AuthTokenData>> => {
  const refreshToken = String(
    payload.refreshToken || payload.refresh_token || ''
  ).trim()

  if (!refreshToken) {
    return mockDelay(mockFail('refresh token missing', 401))
  }

  return mockDelay(mockOk(createToken('mock-user'), 'token refreshed'))
}

export const mockLogout = (): Promise<ApiResponse<null>> => {
  return mockDelay(mockOk(null, '退出成功'))
}

