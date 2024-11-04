import httpClient from 'utils/httpClient';

const route = '/mail-chimp';

export const getList = (params) => {
  return httpClient.get(route, { params });
};

export const getListTemplate = (params) => {
  return httpClient.get(route + '/transaction/template', { params });
};

export const sendListMail = (params) => {
  return httpClient.post(route + '/transaction/send-list', params);
};

export const sentOneMail = (params) => {
  return httpClient.post(route + '/transaction/send-one', params);
};

export const getSender = (params) => {
  return httpClient.get(route + '/transaction/sender', params);
};

export const sendListMailToCustomerLeads = (params) => {
  return httpClient.post(route + '/transaction/send-list-leads', params);
};

export const sendListMailToMember = (params) => {
  return httpClient.post(route + '/transaction/send-list-member', params);
};
