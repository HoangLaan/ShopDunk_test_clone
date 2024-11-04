import httpClient from 'utils/httpClient';

const purchaseOrderDivisionService = {
  getList: (params) => {
    return httpClient.get('/purchase-order-division', { params });
  },
  getById: (id) => {
    return httpClient.get(`/purchase-order-division/${id}`);
  },
  create: (payload) => {
    return httpClient.post('/purchase-order-division', payload);
  },
  update: (payload) => {
    return httpClient.put('/purchase-order-division/', payload);
  },
  delete: (list_id = []) => {
    return httpClient.delete('/purchase-order-division', { data: { list_id } });
  },
  getPurchaseOrderDetail: (id) => {
    return httpClient.get(`/purchase-orders/${id}`);
  },
  getPoAndDoDetail: (id) => {
    return httpClient.get(`/purchase-orders/get-do-po/${id}`);
  },

  getPoAndDoDetailMulti: (po_ids = []) => {
    return httpClient.get(`/purchase-orders/get-do-po-multi`, {params: {po_ids}});
  },

  // review level
  getReviewLevelList: (params) => {
    return httpClient.get('/purchase-order-division/review-level', { params });
  },
  getPositionOptions: (params) => {
    return httpClient.get('/purchase-order-division/get-position-options', { params });
  },
  createReviewLevel: (params) => {
    return httpClient.post('/purchase-order-division/review-level', params);
  },
  deleteReviewLevel: (list_id = []) => {
    return httpClient.delete('/purchase-order-division/review-level', { data: { list_id } });
  },
  createMultiStore: (payload) =>{
    return httpClient.post('/purchase-order-division/multi-store', payload)
  },
  updateMultiStore: (payload) =>{
    return httpClient.put('/purchase-order-division/multi-store', payload)
  },
  getListPurchaseOrderDetail: (payload) => {
    return httpClient.post(`/purchase-orders/list-detail` ,  payload);
  },
  getListStocksOrderDivison : (params) => {
    return httpClient.post(`/purchase-order-division/list-stock` ,  {params});
  },
  genCodeDivison : (params) => {
    return httpClient.post(`/purchase-order-division/genCodeDivision` ,  {params});
  },
  getStockOfBusiness: (params) => {
    return httpClient.get(`/purchase-order-division/stock-of-business` ,  {params});
  },
  getInventoryByProduct : (params) => {
    return httpClient.post(`/purchase-order-division/inventory-product` ,  params);
  },
  getBusinessByStore : (params) => {
    return httpClient.get(`/purchase-order-division/business-options` ,  {params});
  }
};

export default purchaseOrderDivisionService;
