import _Cookies from 'universal-cookie';

import { COOKIE_JWT } from '../utils/constants';

const cookie = new _Cookies();

export const setCookie = (key, value, expires = 1) => {
  try {
    let minutes = expires * 1440;
    let d = new Date();
    d.setTime(d.getTime() + minutes * 60 * 1000);
    cookie.set(key, value, { path: '/', expires: d });
  } catch (error) {}
};

export const removeCookie = (key) => {
  cookie.remove(key, {
    expires: 1,
  });
};

export const getAcessToken = (_ctx = null) => {
  let _accessToken = null;
  let _cookieToken = cookie.get(COOKIE_JWT);
  if (_cookieToken) {
    let { accessToken = '' } = _cookieToken || {};
    _accessToken = accessToken;
  }
  return _accessToken;
};

export const getCookie = (key) => {
  try {
    return cookie.get(key);
  } catch (error) {
    console.log({ error });
  }
};

export const getRefreshToken = (_ctx = null) => {
  let tokenObj = null;
  let _cookieToken = cookie.get(COOKIE_JWT);
  if (_cookieToken) tokenObj = _cookieToken;
  return tokenObj;
};
