import api from 'utils/httpClient';

export const getListNews = (params) => {
  return api.get('/static-content', { params });
};

export const generateStaticCode = (params) => {
  return api.get('/static-content/generate-group-code', params );
}

export const createNews = (params) => {
  return api.post('/static-content', params);
};

export const updateNews = (id, params) => {
  return api.put(`/static-content/${id}`, params);
};

export const getDetail = (id) => {
  return api.get(`/static-content/${id}`);
};

export const exportExcel = (payload) => {
  return api.post('/static-content/export-excel', payload, { responseType: 'blob' });
};

export const deleteNews = (params) => {
  let ids;
  if (Array.isArray(params)) {
    ids = (params || []).map((x) => x.static_id).join(',');
  } else {
    ids = `${params}`;
  }
  return api.delete(`/static-content/delete`, { data: { ids } });
};
