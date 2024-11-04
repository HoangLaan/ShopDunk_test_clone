import httpClient from 'utils/httpClient';

const getList = (params) => {
  return httpClient.get('/purchase-requisition-type', { params });
};

const getById = (id) => {
  return httpClient.get(`/purchase-requisition-type/${id}`);
};

const create = (payload) => {
  return httpClient.post('/purchase-requisition-type', payload);
};

const update = (payload) => {
  return httpClient.put('/purchase-requisition-type/', payload);
};

const _delete = (list_id = []) => {
  return httpClient.delete('/purchase-requisition-type', { data: { list_id } });
};

const purchaseRequisitionTypeService = {
  getList,
  getById,
  create,
  update,
  delete: _delete,
};

export default purchaseRequisitionTypeService;
