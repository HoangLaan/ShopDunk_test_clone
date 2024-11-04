import httpClient from 'utils/httpClient';

export const getListStocksInType = (params) => {
    return httpClient.get('/stocks-in-type', { params });
};

export const createStocksInType = (params) => {
    return httpClient.post('/stocks-in-type', params);
};

export const updateStocksInType = (id, params) => {
    return httpClient.put(`/stocks-in-type/${id}`, params);
};

export const getDetail = (id) => {
    return httpClient.get(`/stocks-in-type/${id}`);
};

export const deleteStocksInType = (params) => {
    let ids
    if (Array.isArray(params)) {
        ids = ((params || []).map((x) => x.stocks_in_type_id)).join(',');
    } else {
        ids = `${params}`
    }
    return httpClient.delete(`/stocks-in-type/delete`, { data: { ids } });
};

export const getListStocksInReviewOptions = (params) => {
    return httpClient.get('/stocks-in-type/stocks-review-level/get-options', { params });
};

export const getListUserReviewById = (params) => {
    return httpClient.get(`/stocks-in-type/get-user`, { params });
};


