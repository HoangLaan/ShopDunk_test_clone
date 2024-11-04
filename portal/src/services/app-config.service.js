import httpClient from 'utils/httpClient';

const path = '/app-config';

export const getConfigValue = (params) => {
    return httpClient.get(`${path}/get-by-key`, { params });
}

export const updatePageConfig = (params) => {
    return httpClient.put(`${path}/update`, params);
}

export const getAllConfig = (params) => {
    return httpClient.get(`${path}/get-all-config`, {params});
}