import httpClient from 'utils/httpClient.js';

const path = '/coupon';

export const getListCoupon = (params = {}) => {
  return httpClient.get(`${path}`, { params });
};

export const getListRsError = (params = {}) => {
  return httpClient.get(`/rs-error`, { params });
};

export const getListCustomerType = (params = {}) => {
  return httpClient.get(`/customer-type`, { params });
};

export const delCouponService = (list_id = []) => {
  return httpClient.delete(`${path}`, { data: { list_id } });
};

export const createCouponService = (values) => {
  return httpClient.post(`${path}`, values);
};

export const updateCouponService = (values) => {
  return httpClient.put(`${path}`, values);
};

export const getDetaiCouponService = (id) => {
  return httpClient.get(`${path}/${id}/detail`);
};

export const getListCouponService = (id) => {
  return httpClient.get(`${path}/${id}/detail/list-coupon`);
};

export const getListAutoGenCouponService = (id, params) => {
  return httpClient.get(`${path}/${id}/detail/list-auto-gen-coupon`, { params });
};

export const getpOptions = () => {
  return httpClient.get(`${path}/error-group/options`);
};

export const getCountAllCoupon = () => {
  return httpClient.get(`${path}/count-all`);
};

export const exportExcelAutoGenCoupon = (coupon_id,params) => {
  const header = {
    responseType: `blob`,
  };
  return httpClient.get(`${path}/export-excel/${coupon_id}`, { params, ...header });
};

export const getCouponOptions = () => {
  return httpClient.get(`${path}/get-options`);
}
