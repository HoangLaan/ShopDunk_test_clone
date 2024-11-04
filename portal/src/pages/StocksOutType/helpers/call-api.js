import httpClient from "utils/httpClient";

export const getListStocksOutType = (params) => {
    return httpClient.get('/stocks-out-type', { params });
};

export const createStocksOutType = (params) => {
    return httpClient.post('/stocks-out-type', params);
};

export const updateStocksOutType = (id, params) => {
    return httpClient.put(`/stocks-out-type/${id}`, params);
};

export const getDetail = (id) => {
    return httpClient.get(`/stocks-out-type/${id}`);
};

export const deleteStocksOutType = (params) => {
    let ids
    if (Array.isArray(params)) {
        ids = ((params || []).map((x) => x.stocks_out_type_id)).join(',');
    } else {
        ids = `${params}`
    }
    return httpClient.post(`/stocks-out-type/delete`, { ids });
};

export const getListStocksOutReviewOptions = (params) => {
    return httpClient.get('/stocks-out-type/stocks-review-level/get-options', { params });
};

export const getListUserReviewById = (params) => {
    return httpClient.get(`/stocks-out-type/get-user`, { params });
};


