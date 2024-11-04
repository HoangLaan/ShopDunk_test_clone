import httpClient from 'utils/httpClient';

const DEFINED_PATH_ROUTE = '/purchase-cost';
const DEFINED_PATH_ROUTE_OPTION_STIR = '/stocks-in-request';

const getOptionPurchaseStRequest = (params = []) => {
  const DEFEND_PATH_OPTION = '/get-option-purchase';
  let query = {};
  query.purchase_order_id = params;
  return httpClient.get(DEFINED_PATH_ROUTE_OPTION_STIR + DEFEND_PATH_OPTION, { params: query });
};

const getOptionPurchaseStRequestImport = (params = {}) => {
  const DEFEND_PATH_OPTION = '/get-option-purchase-import';
  return httpClient.get(DEFINED_PATH_ROUTE_OPTION_STIR + DEFEND_PATH_OPTION, { params });
};

const getProductPurchaseStRequest = (arrayStRequest = {}) => {
  const DEFEND_PATH_OPTION = '/product-purchase';
  return httpClient.get(DEFINED_PATH_ROUTE_OPTION_STIR + DEFEND_PATH_OPTION,  { params: arrayStRequest });
};

export const getListPurchaseCost = (params = {}, payment_type = 1) => {
  return httpClient.get(DEFINED_PATH_ROUTE, { params: { ...params, payment_type } });
};

export const getDetailPurchaseCost = (idPurchaseCost) => {
  const DEFEND_PATH_OPTION = DEFINED_PATH_ROUTE + '/' + idPurchaseCost;
  return httpClient.get(DEFEND_PATH_OPTION, {});
};

export const createPurchaseCost = (params) => {
  return httpClient.post(DEFINED_PATH_ROUTE, params);
};

export const updatePurchaseCost = (params) => {
  return httpClient.put(DEFINED_PATH_ROUTE, params);
};

export const deletePurchaseCost = (list_id) => {
  return httpClient.delete(DEFINED_PATH_ROUTE, { data: { list_id } });
};

const servicePurchaseCost = {
  getOptionPurchaseStRequest: getOptionPurchaseStRequest,
  getProductPurchaseStRequest: getProductPurchaseStRequest,
  getListPurchaseCost: getListPurchaseCost,
  getDetailPurchaseCost: getDetailPurchaseCost,
  createPurchaseCost: createPurchaseCost,
  updatePurchaseCost: updatePurchaseCost,
  deletePurchaseCost: deletePurchaseCost,
  getOptionPurchaseStRequestImport: getOptionPurchaseStRequestImport,
}

export default servicePurchaseCost;
