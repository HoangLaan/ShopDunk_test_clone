import httpClient from 'utils/httpClient';

export const connectShopee = (_data = {}) => {
  return httpClient.post('/shopee', _data)
}

export const DisconnectShopee = (_data = {}) => {
  return httpClient.post('/shopee/disconnect', _data)
}

export const saveShopeeToken = (params) => {
  return httpClient.get('/shopee/authorization', {params})
}

export const getListProduct = (_data = {}) => {
  return httpClient.post('/shopee/get-list-product', _data)
}

export const getOptionProduct = (params) => {
  return httpClient.get('/shopee/option-product', { params });
}

export const updateProductShopee = (_data = {}) =>{
  return httpClient.post('/shopee/update-product-shopee', _data)
}

export const deleteProductShopee = (_data = {}) =>{
  return httpClient.post('/shopee/delete-product-shopee-id', _data)
}

export const updateStocks = (_data = {}) => {
  return httpClient.post('/shopee/update-stock', _data)
}

export const getListOrder = (_data = {}) => {
  return httpClient.post('/shopee/get-list-order', _data)
}

export const printShipping = (_data = {}) => {
  return httpClient.post('/shopee/print-shipping', _data)
}

export const getOptionShipping = (_data = {}) => {
  return httpClient.post('/shopee/option-shipping', _data)
}

export const shipOrder = (_data = {}) => {
  return httpClient.post('/shopee/ship-order', _data)
}

export const cancelOrder = (_data = {}) => {
  return httpClient.post('/shopee/cancel-order', _data)
}