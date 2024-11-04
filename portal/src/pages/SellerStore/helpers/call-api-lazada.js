import httpClient from 'utils/httpClient';

// Lazada
export const getListShopProfile = (params) => {
  return httpClient.get('/seller-store-connect', { params });
};

export const getconnectLazada = (params) => {
  return httpClient.get('/lazada', { params });
}

export const connectLazada =(params) => {
  return httpClient.get('lazada/profile', { params });
}

export const getListProduct = (_data = {}) => {
  return httpClient.post('/lazada/get-list-product', _data);
}

export const getOptionProduct = (params) => {
  return httpClient.get('/lazada/option-product', { params });
}

export const updateProductLazada = (_data = {}) =>{
  return httpClient.post('/lazada/update-product-lazada', _data);
}

export const deleteProductLazada = (_data = {}) =>{
  return httpClient.post('/lazada/delete-product-lazada-id', _data);
}

export const getOptionStock = (params) => {
  return httpClient.get('/seller-store-connect/option-stock', { params });
}

export const updateStocksId = (_data = {}) =>{
  return httpClient.post('/seller-store-connect/update-stock_id', _data)
}

export const updateSingleStock = (_data = {}) => {
  return httpClient.post('/lazada/update-single-stock', _data)
}

export const getListOrder = (_data = {}) => {
  return httpClient.post('/lazada/get-list-order', _data)
}

export const getOptionShipping =(_data = {}) => {
  return httpClient.post('/lazada/option-shipping', _data)
}

export const printShipping =(_data = {})=> {
  return httpClient.post('/lazada/print-shipping', _data)
}

export const getOptionCancel = (_data = {}) =>{
  return httpClient.post('/lazada/get-option-cancel', _data)
}

export const cancelOrder = (_data = {}) => {
  return httpClient.post('/lazada/cancel-order', _data)
}

export const DisconnectLazada = (_data = {}) => {
  return httpClient.post('/lazada/disconnect', _data)
}

export const updateSuccessOrFailed = (_data = {}) => {
  return httpClient.post('/lazada/update-sucess-failed', _data)
}


export const updateListProductToLazada = (_data = {}) => {
  return httpClient.post('/lazada/update-list-product-lazada', _data)
}
// /update-list-product-lazada