import httpClient from "utils/httpClient";

export const getListDebit = (params) => {
    return httpClient.get('/debit', { params });
};

export const deleteDebit = (list_id) => {
    return httpClient.delete(`/debit`, {data:list_id});
};

// export const CheckTimeKeepingDateConfirm = () => {
//     return httpClient.get(`/date-confirm-time-keeping/check-date-confirm`);
// };

// export const getListMonth = () => {
//     return httpClient.get(`/date-confirm-time-keeping/get-month-option`);
// };
