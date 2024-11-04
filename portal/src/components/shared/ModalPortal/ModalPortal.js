import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import BWButton from '../BWButton';
import ICON_COMMON from 'utils/icons.common';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const ModalPortal = (props) => {
  const {
    wrapperId = 'bw_modal_root',
    title = 'Chọn',
    confirmText = 'Xác nhận',
    onConfirm = () => {},
    onReject,
    rejectText = 'Hủy',
    closeText = 'Đóng',
    open = true,
    onClose = () => {},
    children,
    width = 800,
    loading = false,
    styleModal = {},
    style = {},
    titleModal = {},
    closeModal = {},
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

  if (!open || !isMounted) return null;

  return createPortal(
    <div className='bw_modal bw_modal_open' id={`${wrapperId}_container`} style={{ zIndex: 998 }}>
      <div className={classNames('bw_modal_container', { [`bw_w${width}`]: Boolean(width) })} style={styleModal}>
        <div className='bw_title_modal' style={style}>
          <h3 style={titleModal}>{title}</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} style={closeModal}></span>
        </div>

        <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
          <div className='bw_main_modal'>{children}</div>
        </Spin>
        <div className='bw_footer_modal bw_justify_content_right'>
          {typeof onConfirm === 'function' && (
            <BWButton type='success' icon={ICON_COMMON.save} content={confirmText} onClick={onConfirm} />
          )}
          {typeof onReject === 'function' && (
            <BWButton type='danger' icon={ICON_COMMON.reject} content={rejectText} onClick={onReject} />
          )}
          {typeof onClose === 'function' && (
            <button type='button' className='bw_btn_outline' onClick={onClose}>
              {closeText}
            </button>
          )}
        </div>
      </div>
    </div>,
    wrapperElement,
  );
};

export default ModalPortal;
