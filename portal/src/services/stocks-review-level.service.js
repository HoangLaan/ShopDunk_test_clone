import api from 'utils/httpClient';

export const getList = (params) => {
    return api.get('/stocks-review-level', { params });
};
export const deleteReviewLevel = (id) => {
    return api.delete(`/stocks-review-level/${id}`);
};
export const getDetail = (id) => {
    return api.get(`/stocks-review-level/${id}`);
};
export const create = (params) => {
    return api.post(`/stocks-review-level`, params);
};
export const update = (id, params) => {
    return api.put(`/stocks-review-level/${id}`, params);
};
