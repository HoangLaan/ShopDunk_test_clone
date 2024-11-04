import httpClient from 'utils/httpClient.js';

const ZaloOAService = {
  sendTextMessage: (payload) => {
    return httpClient.post('/zalo-oa/send-text-message', payload);
  },
  getListTemplate: () => {
    return httpClient.get('/zalo-oa/template');
  },
  getTemplateById: (params) => {
    return httpClient.get('/zalo-oa/template/info', { params });
  },
  sendZNS: (payload) => {
    return httpClient.post('/zalo-oa/send-zns', payload);
  },
  getTemplateZaloPay: (params) => {
    return httpClient.get('/zalo-oa/template-zalo-pay', {params});
  },
  getTemplateZaloPayById: (params) => {
    return httpClient.get('/zalo-oa/template-zalo-pay/info', {params});
  },
  sendZNSZaloPay: (payload) => {
    return httpClient.post('/zalo-oa/send-zns-zalo-pay', payload);
  },
};

export default ZaloOAService;
