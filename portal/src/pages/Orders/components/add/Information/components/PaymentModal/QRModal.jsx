import BWButton from 'components/shared/BWButton';
import QRCode from 'react-qr-code';

function ConfirmExportModal({ onClose, paymentURL }) {
  return (
    <div className='bw_modal bw_modal_open'>
      <div className='bw_modal_container bw_w600'>
        <div className='bw_title_modal'>
          <div className='bw_flex' style={{ justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <h3>QR thanh toán</h3>
          </div>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} />
        </div>
        <div style={{ height: 'auto', margin: '20px auto', maxWidth: 250, width: '100%' }}>
          <QRCode
            size={250}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            value={paymentURL}
            viewBox={`0 0 250 250`}
          />
        </div>
        <div className='bw_footer_modal' style={{ justifyContent: 'right' }}>
          <BWButton
            content='Thanh toán'
            onClick={() => {
              window.open(paymentURL, '_self');
            }}></BWButton>
          <button type='button' className='bw_btn_outline bw_close_modal' onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmExportModal;
