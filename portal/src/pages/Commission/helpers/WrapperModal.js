import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const WrapperModal = ({
  id,
  children,
  title,
  isOpen,
  onClose,
  onConfirm,
  styleModal,
  headerStyles,
  titleModal,
  closeModal,
}) => {
  const el = document.createElement('div');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const modalRoot = document.getElementById(id);
    modalRoot.appendChild(el);
    setIsMounted(true);

    return () => {
      modalRoot.removeChild(el);
    };
  }, [el, id]);

  return isMounted && isOpen
    ? ReactDOM.createPortal(
        <div className='bw_modal bw_modal_open' id='bw_addattr'>
          <div className='bw_modal_container bw_w800' style={styleModal}>
            <div className='bw_title_modal' style={headerStyles}>
              <h3 style={titleModal}>{title}</h3>
              <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} style={closeModal}></span>
            </div>
            <div className='bw_main_modal'>{children}</div>
            <div className='bw_footer_modal'>
              <button className='bw_btn bw_btn_success' onClick={onConfirm}>
                <span className='fi fi-rr-check'></span> Chọn
              </button>
              <button className='bw_btn_outline bw_close_modal' onClick={onClose}>
                Đóng
              </button>
            </div>
          </div>
        </div>,
        el,
      )
    : null;
};

export default WrapperModal;
