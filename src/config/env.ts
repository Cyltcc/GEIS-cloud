const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on'])

const readBoolean = (value: unknown, fallback: boolean) => {
  if (typeof value !== 'string') {
    return fallback
  }

  const normalized = value.trim().toLowerCase()
  if (!normalized) {
    return fallback
  }

  return TRUE_VALUES.has(normalized)
}

export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_URL || '/api',
  useMock: readBoolean(import.meta.env.VITE_USE_MOCK, import.meta.env.DEV),
}

