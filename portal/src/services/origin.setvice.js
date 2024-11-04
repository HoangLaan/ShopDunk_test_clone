import httpClient from 'utils/httpClient.js';

export const getList = (params = {}) => {
    return httpClient.get('/origin', { params });
};

export const getDetailOrigin = (id) => {
    return httpClient.get(`/origin/${id}`);
}

export const deleteOrigin = (id) => {
    return httpClient.delete(`/origin/${id}`);
};

export const createOrigin = (params) => {
    return httpClient.post(`/origin`, params);
};

export const updateOrigin = (id, params) => {
    return httpClient.put(`/origin/${id}`, params);
};

export const deleteOriginList = (list_id = []) => {
    return httpClient.delete('/origin', { data: { list_id } });
};