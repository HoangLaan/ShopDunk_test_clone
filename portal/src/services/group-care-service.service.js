import httpClient from 'utils/httpClient.js';

export const getListOptions = (params) => {
    return httpClient.get('/group-care-service/get-options', { params });
};
