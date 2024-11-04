import { Result } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { formatCurrency } from 'pages/Product/helpers';
import { ONEPAY_RESPONSE_MESSAGE } from 'pages/Orders/helpers/constans';
import { useHistory } from 'react-router-dom';

function PaymentResultModal() {
  const [queryParams, setQueryParams] = useState({});
  const history = useHistory();
  const status = useMemo(() => {
    return queryParams.vpc_TxnResponseCode === '0';
  }, [queryParams]);

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    const params = Object.fromEntries(searchParams);
    setQueryParams(params);
  }, [history]);

  return (
    <div className='bw_main_login' style={{ background: 'white' }}>
      <Result
        status={status ? 'success' : 'error'}
        title={ONEPAY_RESPONSE_MESSAGE[queryParams.vpc_TxnResponseCode]}
        subTitle={`Thanh toán ${formatCurrency(queryParams.vpc_Amount / 100)} cho đơn hàng ${
          queryParams.vpc_OrderInfo
        } ${status ? 'thành công' : 'thất bại'}`}
      />
    </div>
  );
}

export default PaymentResultModal;
