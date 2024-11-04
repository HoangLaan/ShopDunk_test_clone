import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import BWButton from 'components/shared/BWButton/index';

const ModalPortal = (props) => {
  const {
    wrapperId,
    title = 'Chọn',
    isOpen = true,
    onClose = () => {},
    onConfirm = () => {},
    children,
    width = '',
  } = props;

  const [wrapperElement, setWrapperElement] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const element = document.createElement('div');
    const modalRoot = document.getElementById(wrapperId);
    modalRoot?.appendChild(element);
    setWrapperElement(element);
    setIsMounted(true);

    return () => {
      modalRoot?.removeChild(element);
    };
  }, [wrapperId]);

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <div className='bw_modal bw_modal_open' id={`${wrapperId}_container`}>
      <div className={classNames('bw_modal_container', { [`bw_w${width}`]: Boolean(width) })}>
        <div className='bw_title_modal'>
          <h3>{title}</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose}></span>
        </div>
        <div className='bw_main_modal'>{children}</div>
        <div className='bw_footer_modal bw_justify_content_right'>
          <BWButton type='success' outline={true} content='Xác nhận' onClick={onConfirm} />
          <BWButton type='button' outline className='bw_close_modal' content='Quay về' onClick={onClose} />
        </div>
      </div>
    </div>,
    wrapperElement,
  );
};

export default ModalPortal;
