import httpClient from 'utils/httpClient.js';
const path = '/default-account';
export const getListDefaultAccount = (params = {}) => {
    return httpClient.get(path, { params });
};
export const getDetailDefaultAccount = (id) => {
    return httpClient.get(`${path}/${id}`);
};
export const createDefaultAccount = (params) => {
    return httpClient.post(path, params);
};
export const updateDefaultAccount = (id, params) => {
    return httpClient.put(`${path}/${id}`, params);
};

export const deleteDefaultAccount = (list_id = []) => {
    return httpClient.delete(path, { data: { list_id } });
};

export const getDocumentOptions = (params) => {
    return httpClient.get(`${path}/document-options`, { params });
};

export const getAccountingAccountOptions = (params) => {
    return httpClient.get(`${path}/accounting-account-options`, { params });
};

export const exportExcelDefaultAccount = (params) => {
    const header = {
        responseType: `blob`,
    };
    return httpClient.get(`${path}/export-excel`, { params, ...header });
};
