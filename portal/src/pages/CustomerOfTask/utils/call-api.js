import httpClient from 'utils/httpClient.js';

const route = '/order';

export const getListStoreByUser = (params = {}) => {
    return httpClient.get(route + `/store/options`, { params });
};
