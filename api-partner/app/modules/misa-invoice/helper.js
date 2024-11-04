const axios = require('axios');
const redisHelper = require('../../common/helpers/redis.helper');
const logger = require('../../common/classes/logger.class');
const { MISA_TOKEN_REDIS_KEY } = require('./constants');

const IS_EVIROMENT_PRODUCTION = process.env.NODE_ENV === 'production' ? 1 : 0;

const HttpRequest = ({ tax_code, username, password } = {}) => {
    // nếu là môi trường test -> lấy thông tin tài khoản từ environment
    let base_url = process.env.MISA_BASE_URL;

    if (!IS_EVIROMENT_PRODUCTION) {
        base_url = process.env.MISA_BASE_URL_TEST;
        tax_code = process.env.MISA_TAXCODE;
        username = process.env.MISA_USERNAME;
        password = process.env.MISA_PASS;
    }

    const instance = axios.create({
        baseURL: base_url,
        timeout: 30 * 1000,
        headers: {
            'Content-Type': 'application/json',
            CompanyTaxcode: tax_code,
        },
    });

    instance.interceptors.request.use(
        async (config) => {
            const token = await _getToken(false, { tax_code, username, password, base_url });
            if (token) {
                config.headers['Authorization'] = 'Bearer ' + token;
            } else {
                return Promise.reject({
                    message: `Tài khoản misa mã số thuế ${tax_code}, mật khẩu cho tài khoản ${username} không chính xác !`,
                });
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    instance.interceptors.response.use(
        async (response) => {
            const { data: apiData } = response;
            // refresh token
            if (apiData?.ErrorCode == 'TokenExpiredCode' || apiData?.ErrorCode == 'UnAuthorize') {
                const { config } = response;
                config._retry = true;
                const token = await _getToken(true, { tax_code, username, password, base_url });
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                    return instance(config);
                } else {
                    return Promise.reject({ message: apiData?.ErrorCode });
                }
            }
            if (apiData?.Success && !apiData?.ErrorCode) {
                try {
                    return Promise.resolve(JSON.parse(apiData?.Data));
                } catch (error) {
                    return Promise.resolve(apiData?.Data);
                }
            } else {
                return Promise.reject({ message: apiData?.ErrorCode });
            }
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    return instance;
};

const _getToken = async (refresh = false, { tax_code, username, password, base_url }) => {
    try {
        const savedToken = await redisHelper.get(MISA_TOKEN_REDIS_KEY + '_' + tax_code);

        if (savedToken && !refresh) {
            return savedToken;
        } else {
            const body = {
                appid: process.env.MISA_APP_API,
                taxcode: tax_code,
                username: username,
                password: password,
            };
            const { data } = await axios.post(`${base_url}/auth/token`, body);
            if (data?.Success && !data?.ErrorCode && data?.Data) {
                await redisHelper.set(MISA_TOKEN_REDIS_KEY + '_' + tax_code, data?.Data);
                return data?.Data;
            } else {
                // Mật khẩu misa không đúng
                return null;
            }
        }
    } catch (error) {
        logger.error(error?.message, { function: 'MisaInvoiceHelper.getToken' });
        return null;
    }
};

module.exports = HttpRequest;
