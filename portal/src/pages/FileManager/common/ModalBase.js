import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

const Wrapper = styled(Modal)`
  width: ${props => props.width ?? '100%'};
  height: 100%;
  .ant-modal-content {
    border-radius: 5px !important;
    border-top: 4px solid #ccc;
  }
  .ant-modal-header {
    border-radius: 5px 5px 0 0 !important;
    border-bottom: 1px;
    background: #f0f2f5;
    color: black;
    display: ${props => (props.showHeader ? 'block' : 'none')};
  }
  .ant-modal-close-x {
    display: ${props => (props.showHeader ? 'block' : 'none')};
  }
  .ant-modal-footer {
    display: none;
  }
`;

const ModalBase = props => {
  const { width, visible, title, children, okText, cancelText, showHeader, onClose } = props;
  return (
    <Wrapper
      width={width}
      showHeader={showHeader}
      title={title}
      visible={visible}
      okText={okText}
      cancelText={cancelText}
      onCancel={onClose}>
      {children}
    </Wrapper>
  );
};

ModalBase.propTypes = {
  width: PropTypes.string,
  visible: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node,
  okText: PropTypes.func,
  cancelText: PropTypes.string,
  showHeader: PropTypes.bool,
  onClose: PropTypes.func,
};

export default ModalBase;
