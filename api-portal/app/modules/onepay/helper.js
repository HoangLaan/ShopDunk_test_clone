const axios = require('axios');

const HttpRequest = () => {
    const instance = axios.create({
        baseURL: process.env.API_PARTNER_BASE_URL,
        timeout: 10 * 1000,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `APIKEY ${process.env.API_PARTNER_API_KEY}`,
        },
    });

    instance.interceptors.response.use(
        async (response) => {
            const { data: apiData } = response;
            if (apiData?.status == 200 && apiData?.message === 'success') {
                return Promise.resolve(apiData?.data);
            } else {
                return Promise.reject({ message: apiData?.errors });
            }
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    return instance;
};

module.exports = HttpRequest();
