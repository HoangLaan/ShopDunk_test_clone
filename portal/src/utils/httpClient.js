import { COOKIE_JWT } from 'utils/constants';
import { getAcessToken, getRefreshToken, setCookie } from 'utils/cookie';
import axios from 'axios';
const API_URL_ROOT = process.env.REACT_APP_API_URL_ROOT;
const API_AUTH_REFRESH_TOKEN = 'auth/refresh-token';

const httpClient = () => {
  /**
   * Chuyen doi, format du lieu tu api tra ve cho dong bo
   * @param {Object|null} data
   * @return {Object|null}
   */
  const convertApiErrData = (data) => {
    if (data) {
      let { errors: errArr } = data;

      if (Array.isArray(errArr) && errArr.length) {
        let errors = [];
        errArr.forEach((err) => {
          errors = errors.concat(err.messages || []);
        });
        Object.assign(data, { errors });
      }
    }
    return data;
  };
  const instance = axios.create({
    baseURL: API_URL_ROOT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = getAcessToken();
      //If refresh token then update Token Request
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    (response) => {
      const { config } = response;

      if (config.responseType && config.responseType === 'blob') {
        return response;
      }
      let { data: apiData } = response.data;
      if (config.method === 'delete') {
        if (document.getElementById('data-table-select')) document.getElementById('data-table-select')?.click();
      }
      return apiData;
    },
    async (err) => {
      const originalConfig = err.config;
      let { data: apiData = {}, status } = err.response || {};
      apiData = Object.assign(apiData, { status });
      if (!apiData.status) {
        return Promise.reject('Vui lòng kiểm tra lại kết nối.');
      }
      if (status === 501 || status === 400 || status === 404) {
        return Promise.reject(convertApiErrData(apiData));
      }
      let { message = null } = apiData || {};
      if (
        originalConfig.url !== '/auth/token' &&
        status === 401 &&
        !originalConfig._retry &&
        message === 'jwt expired'
      ) {
        originalConfig._retry = true;
        try {
          let authData = getRefreshToken() || {};
          let { refreshToken } = authData;
          const dataToken = await instance.post(API_AUTH_REFRESH_TOKEN, { refreshToken });
          let { accessToken = '' } = dataToken || {};
          setCookie(COOKIE_JWT, JSON.stringify(dataToken));
          originalConfig.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
      return Promise.reject(apiData);
    },
  );
  return instance;
};

export default httpClient();
