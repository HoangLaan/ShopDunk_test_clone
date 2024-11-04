const axios = require('axios');
const config = require('../../../../config/config');


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


module.exports = {
    createExtensionUser,
    authorizationVoipSamCenter
}