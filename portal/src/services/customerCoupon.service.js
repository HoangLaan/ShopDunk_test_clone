import httpClient from 'utils/httpClient';

const customerCouponService = {
  getList: (params) => httpClient.get('/customer-coupon', { params }),
  getById: (id) => httpClient.get(`/customer-coupon/${id}`),
  update: (payload) => httpClient.put('/customer-coupon/', payload),
};

export default customerCouponService;
