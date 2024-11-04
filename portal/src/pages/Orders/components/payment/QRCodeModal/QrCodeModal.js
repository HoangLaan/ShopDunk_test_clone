import { useEffect, useState } from 'react';

import { showToast } from 'utils/helpers';
import { generatePaymentQR } from 'utils/paymentQR';
import { formatPrice, getErrorMessage } from 'utils/index';
import { useMqttSubscribe } from 'context/MqttProvider';
import useAgeOfComponent from 'hooks/useAgeOfComponent';

import BWImage from 'components/shared/BWImage';

function QrCodeModal({ onClose, bankData, paymentFormData, amount, orderNo }) {
  const mqttMessage = useMqttSubscribe(process.env.REACT_APP_MQTT_TOPIC_VIETINBANK);
  const { createdTime } = useAgeOfComponent();

  const [qrDataURL, setQRDataURL] = useState('');

  useEffect(() => {
    if (
      mqttMessage &&
      mqttMessage.order_no === orderNo?.trim() &&
      +mqttMessage.amount === +amount &&
      +mqttMessage.payment_form_id === +paymentFormData.payment_form_id &&
      +mqttMessage.bank_account_id === +bankData.bank_account_id &&
      createdTime > 0 &&
      Date.now() - createdTime > 1000
    ) {
      showToast.success('Thanh toán đơn hàng thành công');
      onClose();
    }
  }, [mqttMessage, orderNo, amount, paymentFormData.payment_form_id, bankData.bank_account_id, onClose, createdTime]);

  useEffect(() => {
    // generatePaymentQR(bankData?.bank_number, bankData?.bank_account_name, 970415, amount, orderId)
    generatePaymentQR(
      // bankData?.bank_number || '111002669084',
      // bankData?.bank_account_name || 'CONG TY CO PHAN HESMAN VIETNAM',
      '111002669084',
      'CONG TY CO PHAN HESMAN VIETNAM',
      970415,
      Math.round(amount),
      `${orderNo?.trim()}x${paymentFormData.payment_form_id}x${bankData.bank_account_id}`,
    )
      .then((res) => {
        setQRDataURL(res.qrDataURL);
      })
      .catch((error) => {
        showToast.error(
          getErrorMessage({
            message: error?.desc || 'Đã xảy ra lỗi vui lòng kiểm tra lại.',
          }),
        );

        onClose();
      });
  }, [setQRDataURL, amount, orderNo, onClose, bankData, paymentFormData]);

  return (
    <div className='bw_modal bw_modal_open' id='bw_add_customer'>
      <div className='bw_modal_container bw_w600'>
        <div className='bw_title_modal'>
          <h3>QR Code chuyển khoản</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} />
        </div>
        <div className='bw_main_modal bw_flex bw_justify_content_center'>
          <BWImage src={qrDataURL} preview={false} style={{ width: '300px' }} />
        </div>

        <div className='bw_flex ' style={{ width: '100%' }}>
          <div style={{ width: '20%' }}>
            Tên Ngân Hàng:
          </div>
          <strong>
            {bankData?.bank_name}
          </strong>
        </div>

        <div className='bw_flex ' style={{ width: '100%', marginTop: '5px' }}>
          <div style={{ width: '20%' }}>
            Số Tài Khoản:
          </div>
          <strong>
            {bankData?.bank_number}
          </strong>
        </div>

        <div className='bw_flex ' style={{ width: '100%', marginTop: '5px' }}>
          <div style={{ width: '20%' }}>
            Chủ Tài Khoản:
          </div>
          <strong>
            {bankData?.bank_account_name}
          </strong>
        </div>

        <div className='bw_flex ' style={{ width: '100%', marginTop: '5px' }}>
          <div style={{ width: '20%' }}>
            Số Tiền:
          </div>
          <strong>
            {formatPrice(Math.round(amount), true, ',')}
          </strong>
        </div>

        <div className='bw_flex ' style={{ width: '100%', marginTop: '5px' }}>
          <div style={{ width: '20%' }}>
            Nội Dung CK:
          </div>
          <strong>
            {`${orderNo?.trim()}x${paymentFormData.payment_form_id}x${bankData.bank_account_id}`}
          </strong>
        </div>
        {/* <div className='bw_footer_modal bw_mt_1'>
          <button type='button' className='bw_btn bw_btn_success'>
            <span className='fi fi-rr-check' /> Thêm mới
          </button>
          <button type='button' className='bw_btn_outline bw_close_modal' onClick={onClose}>
            Đóng
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default QrCodeModal;
