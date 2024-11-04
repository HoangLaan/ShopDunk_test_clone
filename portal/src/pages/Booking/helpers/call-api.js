import httpClient from 'utils/httpClient.js';

const route = '/appointments';

export const getListBooking = (params = {}) => {
  return httpClient.get(route, { params });
};
// export const getInformationWithOrder = (params = {}) => {
//   return httpClient.get('/order-status/information-orders', { params });
// };

export const create = (params) => {
  return httpClient.post(route, params);
};

export const update = (id, params) => {
  return httpClient.put(route + `/${id}`, params);
};

export const read = (id, params) => {
  return httpClient.get(route + `/${id}`, params);
};

export const deleteItem = (params) => {
  return httpClient.delete(route + `/delete-booking`, { params });
};


export const exportPDF = (id, params = {}) => {
  return httpClient.get(route + `/export-pdf/${id}`, { params });
};

export const exportPreOrder = (id, params = {}) => {
  return httpClient.get(route + `/export-pre-order/${id}`, { params });
};

// tạo mã hoá đơn cho đơn hàng

export const createOrderNo = (params = {}) => {
  return httpClient.get(route + `/code`, { params });
};
// lấy danh sách kho theo cửa hàng
export const getStocksOpts = (params = {}) => {
  return httpClient.get(`/stocks/get-options`, { params });
};
// lấy danh sách sản phẩm
// export const getProductList = (id, params = {}) => {
//   return httpClient.get(route + `/stocks/${id}/products`, { params });
// };

// lấy danh sách nhân viên nhận hoa hồng
export const getUserCommissionOpts = (params = {}) => {
  return httpClient.get(route + `/option-user`, { params });
};

// lấy danh sách ngân hàng
export const getBankOpts = (params = {}) => {
  return httpClient.get(route + `/bank-account/get-options`, { params });
};

export const uploadReceiveSlipFile = (file, onUploadProgress) => {
  let formData = new FormData();
  formData.append('files', file);
  return httpClient.post('/receive-slip/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

// Huỷ đơn hàng
export const cancelOrder = (id, params = {}) => {
  return httpClient.put(route + `/${id}/cancel`, { params });
};

// Lấy danh sách địa chỉ nhận hàng của khách hàng

export const getListAddressBook = (id, params = {}) => {
  return httpClient.get(`/account/address-book/${id}`, { params });
};

// Thêm danh sách địa chỉ nhận hàng cho KH

export const createAddressBook = (params = {}) => {
  return httpClient.post(`/account/address-book`, params);
};

export const getListStoreByUser = (params = {}) => {
  return httpClient.get(route + `/store/options`, { params });
};

export const getListPromotion = (params = {}) => {
  return httpClient.post(route + `/promotion`, params);
};

export const getCoupon = (params = {}) => {
  return httpClient.post(route + `/coupon`, params);
};

export const getPreOrderCoupon = (params = {}) => {
  return httpClient.get(route + `/pre-order-coupon`, { params });
};

export const getProduct = (params = {}) => {
  return httpClient.get(route + `/product`, { params });
};

export const createReceiveSlip = (id, params = {}) => {
  return httpClient.put(route + `/payment/${id}`, params);
};

export const getOrderType = (params = {}) => {
  return httpClient.get(route + `/order-type`, { params });
};

export const cashPayment = (params = {}) => {
  return httpClient.post(route + `/cash-payment`, params);
};

export const getPaymentHistory = (orderId) => {
  return httpClient.get(route + `/payment-history/${orderId}`);
};

export const getInformationWithOrder = (params = {}) => {
  return httpClient.get('/order-status/information-orders', { params });
};


export const getListCustomer = (params = {}) => {
  return httpClient.get(route + '/customer-list', { params });
};

export const getProductListReport = (params = {}) => {
  return httpClient.post(route + '/product-report', params);
};

export const getReportChart = (params = {}) => {
  return httpClient.post(route + '/report-chart', params);
};

export const countOrderByCustomer = (params = {}) => {
  return httpClient.get(route + '/count-by-customer', { params });
};

export const getPaymentPolicy = (params = {}) => {
  return httpClient.get(route + '/payment-policy');
};

export const getGroupService = (params = {}) => {
  return httpClient.get(route + `/get-parents-group-service`, { params });
};

// Lấy danh sách địa chỉ nhận hàng của chi nhánh với đơn nội bộ
export const getListBusinessAddress = (params = {}) => {
  return httpClient.get(route + `/business-info`, { params });
};

export const updateInstallmentOrder = (params = {}) => {
  return httpClient.put(route + '/installment-status', params);
};
