const axios = require('axios');
const config = require('../../../../config/config');

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
        baseURL: config.smsBrandname.rootUrl,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    instance.interceptors.request.use(
        (config) => {
            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    instance.interceptors.response.use(
        (response) => {
            return response;
        },

        async (err) => {
            // const originalConfig = err.config;

            let { data: apiData = {}, status } = err.response || {};
            apiData = Object.assign(apiData, { status });

            if (!apiData.status) {
                return Promise.reject('Vui lòng kiểm tra lại kết nối.');
            }

            if (status === 501 || status === 400 || status === 404) {
                return Promise.reject(convertApiErrData(apiData));
            }

            return Promise.reject(apiData);
        },
    );
    return instance;
};

module.exports = httpClient();
