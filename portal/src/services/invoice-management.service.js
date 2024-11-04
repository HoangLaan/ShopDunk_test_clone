import httpClient from 'utils/httpClient.js';

const getList = (params) => {
    return httpClient.get('/invoice-management', { params });
};
const InvoiceManagementService = {
    getList,
};

export default InvoiceManagementService;
