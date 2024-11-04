import React from 'react';
import DiscountProgramProductTable from './DiscountProgramProductTable';

const DiscountProgramModal = ({ onClose, fieldProduct, manufacture_id }) => {
  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '49rem',
    marginLeft: '-20px',
    height: '4rem',
  };
  const titleModal = {
    marginLeft: '2rem',
    marginTop: '1rem',
  };
  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };
  ////end zone

  return (
    <div className='bw_modal bw_modal_open' id='bw_addattr'>
      <div className='bw_modal_container bw_open bw_w800' style={styleModal}>
        <div className='bw_title_modal' style={headerStyles}>
          <h3 style={titleModal}>Chọn sản phẩm</h3>
          <span onClick={onClose} className='fi fi-rr-cross-small bw_close_modal' style={closeModal} />
        </div>
        <DiscountProgramProductTable manufacture_id={manufacture_id} fieldProduct={fieldProduct} />
        <div className='bw_footer_modal bw_mt_1'>
          <button
            type='button'
            className='bw_btn bw_btn_success'
            onClick={(e) => {
              document.getElementById('trigger-delete').click();
              onClose();
            }}>
            <span className='fi fi-rr-check' /> Xác nhận
          </button>
          <button type='button' onClick={onClose} className='bw_btn_outline bw_btn_outline_success'>
            <span className='fi fi-rr-refresh' />
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountProgramModal;
