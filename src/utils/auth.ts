import Cookies from "js-cookie";
import { storageSession } from "@pureadmin/utils";
import { useUserStoreHook } from "@/store/modules/user";

export interface DataInfo<T> {
  /** token */
  accessToken: string;
  /** accessToken expire timestamp */
  expires: T;
  /** refresh token */
  refreshToken: string;
  /** username */
  username?: string;
  /** current user roles */
  roles?: Array<string>;
}

export interface IUserInfo {
  avatar: string;
  bound_phone: boolean;
  bound_wechat: boolean;
  created_at: string;
  email: string;
  id: number;
  info: Array<any>;
  name: string;
  updated_at: string;
}

export const sessionKey = "user-info";
export const TokenKey = "authorized-token";
export const LocalTokenKeys = ["token", "access_token", "accessToken"] as const;

/** get token payload from cookie/session */
export function getToken(): DataInfo<number> {
  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey) as string)
    : storageSession().getItem(sessionKey);
}

/** get accessToken for request header */
export function getAccessToken(): string {
  for (const key of LocalTokenKeys) {
    const value = localStorage.getItem(key);
    if (value) {
      return value;
    }
  }
  return "";
}

/**
 * set token and related session info
 */
export function setToken(data: DataInfo<number>) {
  let expires = 0;
  const { accessToken, refreshToken } = data;

  // backend expires uses seconds, convert to ms
  expires = data.expires * 1000 + Date.now();

  const cookieString = JSON.stringify({ accessToken, expires });
  expires > 0
    ? Cookies.set(TokenKey, cookieString, {
        expires: (expires - Date.now()) / 86400000
      })
    : Cookies.set(TokenKey, cookieString);
  LocalTokenKeys.forEach((key) => localStorage.setItem(key, accessToken));

  function setSessionKey(username: string, roles: Array<string>) {
    useUserStoreHook().SET_USERNAME(username);
    useUserStoreHook().SET_ROLES(roles);
    storageSession().setItem(sessionKey, {
      refreshToken,
      expires,
      username,
      roles
    });
  }

  if (data.username && data.roles) {
    const { username, roles } = data;
    setSessionKey(username, roles);
  } else {
    const username =
      storageSession().getItem<DataInfo<number>>(sessionKey)?.username ?? "";
    const roles =
      storageSession().getItem<DataInfo<number>>(sessionKey)?.roles ?? [];
    setSessionKey(username, roles);
  }
}

/** clear token/session/localStorage token keys */
export function removeToken() {
  Cookies.remove(TokenKey);
  sessionStorage.clear();
  LocalTokenKeys.forEach((key) => localStorage.removeItem(key));
}

/** format token */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};
