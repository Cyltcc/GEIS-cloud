export interface DataInfo<T> {
  /** token */
  accessToken: string;
  /** accessToken expire timestamp in milliseconds */
  expires: T;
  /** refresh token */
  refreshToken: string;
}

const TOKEN_STORAGE_KEY = "geis-token-info";
const TOKEN_REFRESH_THRESHOLD = 30 * 1000;
const DEFAULT_EXPIRES_SECONDS = 7200;
const SECOND_TIMESTAMP_THRESHOLD = 1_000_000_000;
const MILLISECOND_TIMESTAMP_THRESHOLD = 10_000_000_000;

const LEGACY_SESSION_KEYS = ["token-info", "user-info"] as const;
const LEGACY_COOKIE_KEY = "authorized-token";
const LEGACY_ACCESS_TOKEN_KEYS = ["token", "access_token", "accessToken"] as const;

const canUseStorage = () => typeof window !== "undefined";

const safeGetItem = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const safeRemoveLocalItem = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore storage access errors
  }
};

const safeRemoveSessionItem = (key: string) => {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore storage access errors
  }
};

const removeCookie = (name: string) => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; Max-Age=0; path=/`;
};

const clearLegacyToken = () => {
  if (!canUseStorage()) {
    return;
  }

  LEGACY_ACCESS_TOKEN_KEYS.forEach((key) => safeRemoveLocalItem(key));
  LEGACY_SESSION_KEYS.forEach((key) => safeRemoveSessionItem(key));
  removeCookie(LEGACY_COOKIE_KEY);
};

const isTokenInfo = (value: unknown): value is DataInfo<number> => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const token = value as Partial<DataInfo<number>>;
  return (
    typeof token.accessToken === "string" &&
    typeof token.refreshToken === "string" &&
    typeof token.expires === "number"
  );
};

/** get token payload from the single localStorage source */
export function getToken(): DataInfo<number> | null {
  if (!canUseStorage()) {
    return null;
  }

  const rawToken = safeGetItem(TOKEN_STORAGE_KEY);
  if (!rawToken) {
    clearLegacyToken();
    return null;
  }

  try {
    const token = JSON.parse(rawToken) as unknown;
    if (!isTokenInfo(token)) {
      removeToken();
      return null;
    }

    clearLegacyToken();
    return token;
  } catch {
    removeToken();
    return null;
  }
}

/** get accessToken for request header */
export function getAccessToken(): string {
  return getToken()?.accessToken || "";
}

export function getRefreshToken(): string {
  return getToken()?.refreshToken || "";
}

export function isAccessTokenExpired(token = getToken()): boolean {
  if (!token?.accessToken) {
    return true;
  }

  return token.expires <= Date.now() + TOKEN_REFRESH_THRESHOLD;
}

const normalizeExpiresAt = (expires: number) => {
  if (!Number.isFinite(expires) || expires <= 0) {
    return Date.now() + DEFAULT_EXPIRES_SECONDS * 1000;
  }

  if (expires >= MILLISECOND_TIMESTAMP_THRESHOLD) {
    return expires;
  }

  if (expires >= SECOND_TIMESTAMP_THRESHOLD) {
    return expires * 1000;
  }

  return Date.now() + expires * 1000;
};

/**
 * set token
 */
export function setToken(data: DataInfo<number>) {
  if (!canUseStorage()) {
    return;
  }

  const expires = normalizeExpiresAt(data.expires);
  const tokenInfo: DataInfo<number> = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expires
  };

  safeSetItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenInfo));
  clearLegacyToken();
}

/** clear token keys managed by the auth module */
export function removeToken() {
  if (!canUseStorage()) {
    return;
  }

  safeRemoveLocalItem(TOKEN_STORAGE_KEY);
  clearLegacyToken();
}

/** format token */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};
