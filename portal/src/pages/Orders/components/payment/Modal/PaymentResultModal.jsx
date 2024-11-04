import { Result } from 'antd';
import { useMemo } from 'react';
import { formatCurrency } from 'pages/Product/helpers';
import { ONEPAY_RESPONSE_MESSAGE } from 'pages/Orders/helpers/constans';

function PaymentResultModal({ onClose, paymentData }) {
  const status = useMemo(() => {
    return paymentData.vpc_TxnResponseCode === '0';
  }, [paymentData]);

  return (
    <div className='bw_modal bw_modal_open'>
      <div className='bw_modal_container bw_w600'>
        <div className='bw_title_modal'>
          <div className='bw_flex' style={{ justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <h3>Kết quả thanh toán</h3>
          </div>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} />
        </div>

        <Result
          status={status ? 'success' : 'error'}
          title={ONEPAY_RESPONSE_MESSAGE[paymentData.vpc_TxnResponseCode]}
          subTitle={`Thanh toán ${formatCurrency(paymentData.vpc_Amount / 100)} cho đơn hàng ${
            paymentData.vpc_OrderInfo
          } ${status ? 'thành công' : 'thất bại'}`}
        />

        <div className='bw_footer_modal' style={{ justifyContent: 'right' }}>
          <button type='button' className='bw_btn_outline bw_close_modal' onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentResultModal;
