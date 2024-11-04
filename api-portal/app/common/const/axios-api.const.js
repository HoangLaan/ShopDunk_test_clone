const axios = require("axios");
const queryString = require('query-string');
const logger = require("../classes/logger.class");
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');

const _checkToken = async (_config) => {
    const pool = await mssql.pool;
    try {
        const data = await pool.request()
            .execute("MD_TOKEN_GetTokenZalo");
        if (data.recordset && data.recordset.length > 0) {
            let data_token = {
                access_token: data.recordset[0].ACCESSTOKEN,
                refresh_token: data.recordset[0].REFRESHTOKEN
            }
            return _request(_config, data_token)
        }
    } catch (error) {
        logger.error(error, "Lỗi lấy dữ liệu token")
    }
}

const _refresh_token = async (_configRequet, key_netWork) => {
    const data = {
        refresh_token: key_netWork ? key_netWork.refresh_token : null,
        app_id: process.env.ZALO_APP_ID,
        grant_type: "refresh_token"
    }
    let _config = Object.assign({
        url: 'access_token',
        method: 'post',
        data: queryString.stringify(data)
    });
    let config = Object.assign({
        baseURL: process.env.ZALO_AUTH_URL,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'secret_key': process.env.HASH_SECRET_ZALO_KEY
        },
    }, _config = _config || {});
    let incomming = new Promise((resolve, reject) => {
        return axios(config)
            .then(async response => {
                // handle success
                 // không xoá dòng này
                let new_data_token = {
                    access_token: null,
                    refresh_token: null
                }

                if (response.data) {
                    new_data_token = {
                        access_token: response.data.access_token,
                        refresh_token: response.data.refresh_token
                    }
                    let res = saveToken(new_data_token);
                    if (res) {
                        return _request(_configRequet, new_data_token);
                    }
                }
            })
            .then(resolve)
            .catch(err => {
                logger.error(err, "Lỗi _refresh_token")
                console.log(err);
            });
    });
    return incomming;
}

const _request = async (_config, key_netWork) => {
    let config = Object.assign({
        baseURL: process.env.ZALO_URL,
        headers: {
            'content-type': 'application/json',
            'access_token': key_netWork ? key_netWork.access_token : null
        },
    }, _config = _config || {});

    let incomming = new Promise((resolve, reject) => {
        return axios(config)
            .then(response => {

                if (response.data.error === -216) {
                   return _refresh_token(_config, key_netWork);
                } else {
                    if (config.responseType && config.responseType === 'blob') {
                        return response.data;
                    };
                    let { data: apiData } = response.data;
                    apiData = Object.assign(apiData || {},);
                    return apiData;
                }
            })
            .then(resolve)
            .catch(err => {
                logger.error(err, "Lỗi _request API")
                console.log(err);
            });
    });

    return incomming;
}

const saveToken = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    try {
        const data = await pool.request()
            .input('ACCESSTOKEN', apiHelper.getValueFromObject(bodyParams, 'access_token'))
            .input('REFRESHTOKEN', apiHelper.getValueFromObject(bodyParams, 'refresh_token'))
            .execute("MD_TOKEN_CreateOrUpdateToken");
        if (data.recordset && data.recordset[0].RESULT == 1) {
            return true;
        }
    } catch (error) {
        logger.error(error, "Lỗi lưu dữ liệu token")
        return false

    }
}

const getAPI = (url, params, _config) => {
    let config = Object.assign({
        url,
        method: 'get',
        params
    }, { ..._config });
    return _checkToken(config);
}
const postAPI = (url, params, _config) => {
    let config = Object.assign({
        url,
        method: 'post',
        params
    }, { ..._config });
    return _checkToken(config);
}
const deleteAPI = (url, params, _config) => {
    let config = Object.assign({
        url,
        method: 'delete',
        params
    }, { ..._config });
    return _checkToken(config);
}
const pushAPI = (url, params, _config) => {
    let config = Object.assign({
        url,
        method: 'push',
        params
    }, { ..._config });
    return _checkToken(config);
}
module.exports = {
    getAPI,
    postAPI,
    deleteAPI,
    pushAPI

};
