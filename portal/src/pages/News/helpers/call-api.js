import api from 'utils/httpClient';

export const getListNews = (params) => {
  return api.get('/news', { params });
};

export const createNews = (params) => {
  return api.post('/news', params);
};

export const updateNews = (id, params) => {
  return api.put(`/news/${id}`, params);
};

export const getDetail = (id) => {
  return api.get(`/news/${id}`);
};

export const deleteNews = (params) => {
  let ids;
  if (Array.isArray(params)) {
    ids = (params || []).map((x) => x.news_id).join(',');
  } else {
    ids = `${params}`;
  }
  return api.delete(`/news/delete`, { data: { ids } });
};
