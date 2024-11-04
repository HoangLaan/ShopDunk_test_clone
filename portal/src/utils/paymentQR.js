import axios from 'axios';

const httpClient = () => {
  const instance = axios.create({
    baseURL: 'https://api.vietqr.io/v2',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // instance.interceptors.request.use(
  //   (config) => {
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   },
  // );

  instance.interceptors.response.use(
    (response) => {
      const { config } = response;

      if (config.responseType && config.responseType === 'blob') {
        return response;
      }

      let { data: apiData } = response.data;

      if (apiData) {
        return apiData;
      }

      return Promise.reject(response.data);
    },
    async (err) => {
      let { data: apiData = {}, status } = err.response || {};
      apiData = Object.assign(apiData, { status });

      if (!apiData.status) {
        return Promise.reject('Vui lòng kiểm tra lại kết nối.');
      }

      return Promise.reject(apiData);
    },
  );
  return instance;
};

export const generatePaymentQR = (accountNo, accountName, acqId, amount, addInfo) => {
  const params = {
    //Số tài khoản ngân hàng thụ hưởng. Chỉ nhập số, tối thiểu 6 ký tự, tối đa 19 kí tự
    accountNo: accountNo,

    //Tên tài khoản ngân hàng. Nhập tiếng Việt không dấu, viết hoa, tối thiểu 5 ký tự, tối đa 50 kí tự không chứa các ký tự đặc biệt.
    accountName: accountName,

    //Mã định danh ngân hàng (thường gọi là BIN) 6 chữ số, quy đinh bởi ngân hàng nước
    acqId: acqId,

    //Số tiền chuyển. Chỉ nhập số, tối đa 13 kí tự
    amount: amount,

    //Nội dung chuyển tiền. Nhập tiếng Việt không dấu, tối đa 25 ký tự. Không chứa các ký tự đặc biệt ERP+Mã đơn hàng)
    addInfo: addInfo,

    //Định dạng VietQR trả về (text, base64)
    format: 'base64',

    //Mẫu VietQR trả về
    template: process.env.REACT_APP_VIET_QR_TEMPLATE_ID,
  };

  return httpClient().post('/generate', params);
};
