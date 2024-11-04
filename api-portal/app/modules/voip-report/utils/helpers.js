const axios = require('axios');
const config = require('../../../../config/config');

//const

const authorizationVoip = async () =>
    new Promise((resolve, reject) => {
        axios.post(`${config.void.domain}/v1/auth/token`,
            {
                "api_key": config.void.apiKey
            })
            .then(res => {
                resolve(res.data.data)
            })
            .catch(reject)
    })

const authorizationVoipSamCenter = async () =>
    new Promise((resolve, reject) => {
        axios.post(`${config.void.domain}/v1/auth/token`,
            {
                "api_key": config.void.apiKeySamCenter
            })
            .then(res => {
                resolve(res.data.data)
            })
            .catch(reject)
    })

const createExtensionUser = (bodyParams, authToken) =>
    new Promise((resolve, reject) => {
        axios.post(`${config.void.domain}/v3/extension`,
            bodyParams, {
            headers: {
                'Authorization':
                    `${authToken?.token_type} ${authToken?.token}`
            }
        })
            .then(res => resolve(res.data))
            .catch((e) => {
                if (e) {
                    axios.put(`${config.void.domain}/v3/extension/${bodyParams?.extension}`,
                        bodyParams, {
                        headers: {
                            'Authorization':
                                `${authToken?.token_type} ${authToken?.token}`
                        }
                    }).then(res => resolve(res.data))
                        .catch(reject)
                }
            })
    })

    const formatDate = (inputDate, type = '') => {
        if (inputDate) {
            if (type == 'start') {
                const parts = inputDate.split('/');
                const day = parts[0];
                const month = parts[1];
                const year = parts[2];
                return `${year}-${month}-${day} 00:00:00`;
            } else {
                const parts = inputDate.split('/');
                const day = parts[0];
                const month = parts[1];
                const year = parts[2];
                return `${year}-${month}-${day} 23:59:59`;
            }
        } else {
            return '';
        }
    };

module.exports = {
    authorizationVoip,
    createExtensionUser,
    authorizationVoipSamCenter,
    formatDate
}