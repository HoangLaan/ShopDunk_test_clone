import httpClient from 'utils/httpClient.js';

export const getListNotify = (url, page, type) => {
  const params = {
    page,
    itemsPerPage: 10,
    type,
  };
  return httpClient.get(url, { params });
};

export const getOptionsGlobal = (params) => {
  return httpClient.get('/global/options', { params });
};

export const getFullName = (params) => {
  return httpClient.get('/global/get-full-name', { params });
};

export const getNotifyByUser = (page) => {
  const params = {
    page,
    itemsPerPage: 10,
  };
  return httpClient.get('/notify', { params });
};

export const updateReadAllNotify = () => {
  return httpClient.get('/notify/many-read');
};

export const updateReadNotify = (id) => {
  return httpClient.post('/notify/read', { notify_user_id: id });
};
