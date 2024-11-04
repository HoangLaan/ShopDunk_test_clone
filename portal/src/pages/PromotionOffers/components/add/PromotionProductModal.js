import React from 'react';
import PromotionsProductTable from './PromotionProductTable';

const PromotionProductModal = ({ onClose, fieldProduct }) => {
  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '50rem',
    marginLeft: '-20px',
    height: '4rem',
    zIndex: 2,
  };
  const titleModal = {
    marginLeft: '2rem',
    marginTop: '1rem',
  };
  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };

  const handleAccept = (value = null) => {
    try {
      document.getElementById('trigger-delete').click();
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  }
  ////end zone
  return (
    <div className='bw_modal bw_modal_open' id='bw_addattr'>
      <div className='bw_modal_container bw_open bw_w800' style={styleModal}>
        <div className='bw_title_modal' style={{ paddingBottom: '0' ,...headerStyles}} >
          <h3 style={titleModal}>Chọn sản phẩm</h3>
          <span onClick={onClose} className='fi fi-rr-cross-small bw_close_modal' style={closeModal} />
        </div>
        <PromotionsProductTable fieldProduct={fieldProduct} 
                  contentSelect='Chọn tất cả sản phẩm'
                  hiddenAction={{ detail: true, delete: true, check: true }} 
                  onClose={onClose}/>
        <div className='bw_footer_modal bw_mt_1'>
          <button
            type='button'
            className='bw_btn bw_btn_success'
            onClick={(e) => {
              handleAccept(e);
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

export default PromotionProductModal;
