import { useState } from 'react';
import { Spin } from 'antd';

function ConfirmReconcile({ onClose, onOK }) {
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
          <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>Thực hiện hủy đối trừ thành công !</p>
        </div>

        <div className='bw_footer_modal bw_mt_1' style={{ justifyContent: 'right' }}>
          <button
            type='button'
            className='bw_btn_success'
            onClick={() => {
              onClose();
              onOK();
            }}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmReconcile;
