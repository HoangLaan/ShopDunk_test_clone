import { useState } from 'react';
import { Spin } from 'antd';
import { showToast } from 'utils/helpers';

function ConfirmExportModal({ onClose, exportInvoice, viewInvoice }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className='bw_modal bw_modal_open' id='bw_add_customer'>
      <div className='bw_modal_container bw_w600'>
        <div className='bw_title_modal'>
          <div className='bw_flex' style={{ justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            {loading ? <Spin /> : <i className='fi fi fi-rr-bell'></i>}
            <h3>Thông báo</h3>
          </div>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} />
        </div>
        <div>
          <p style={{ textAlign: 'center', fontSize: '1.04rem' }}>Xác nhận xuất hóa đơn !</p>
          <p style={{ textAlign: 'center', fontSize: '1rem' }}>
            Bạn cần phải kiểm tra tất cả các thông tin đơn hàng trước khi xuất hóa đơn !
          </p>
        </div>

        <div className='bw_footer_modal bw_mt_1' style={{ justifyContent: 'center' }}>
          <button
            // style={loading ? { opacity: '50%' } : {}}
            style={{
              opacity: '50%',
            }}
            type='button'
            className='bw_btn bw_btn_success'
            onClick={async () => {
              showToast.warning('Tạm thời không cho phép xuất hóa đơn ở môi trường thật !');
              // if (!loading) {
              //   setLoading(true);
              //   await exportInvoice();
              //   setLoading(false);
              //   onClose();
              // }
            }}>
            <span className='fi fi-rr-inbox-out' /> Xuất hóa đơn
          </button>
          <button
            type='button'
            className='bw_btn bw_btn_danger'
            style={loading ? { opacity: '50%' } : {}}
            onClick={async () => {
              if (!loading) {
                setLoading(true);
                await viewInvoice();
                setLoading(false);
              }
            }}>
            <span className='fi fi fi-rr-eye' /> Xem HĐ nháp
          </button>
          <button type='button' className='bw_btn_outline bw_close_modal' onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmExportModal;
