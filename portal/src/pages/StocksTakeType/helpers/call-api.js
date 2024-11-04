import httpClient from "utils/httpClient";

export const getListStocksTakeType = (params) => {
    return httpClient.get('/stocks-take-type', { params });
};

export const createStocksTakeType = (params) => {
    return httpClient.post('/stocks-take-type', params);
};

export const updateStocksTakeType = (id, params) => {
    return httpClient.put(`/stocks-take-type/${id}`, params);
};

export const getDetail = (id) => {
    return httpClient.get(`/stocks-take-type/${id}`);
};

export const deleteStocksTakeType = (params) => {
    let ids
    if (Array.isArray(params)) {
        ids = ((params || []).map((x) => x.stocks_take_type_id)).join(',');
    } else {
        ids = `${params}`
    }
    return httpClient.post(`/stocks-take-type/delete`, { ids });
};

export const getListStocksTakeReviewOptions = (params) => {
    return httpClient.get('/stocks-take-type/stocks-review-level/get-options', { params });
};

export const getListUserReviewById = (params) => {
    return httpClient.get(`/stocks-take-type/get-user`, { params });
};


