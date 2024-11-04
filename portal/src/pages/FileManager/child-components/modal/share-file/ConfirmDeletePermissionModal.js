import ModalBase from 'pages/FileManager/common/ModalBase';
import React from 'react';
import PropTypes from 'prop-types';
import {Typography, Button} from 'antd';
import styled from 'styled-components';

const {Title} = Typography;

const ModalBaseStyled = styled(ModalBase)`
  .ant-modal-header {
    display: none !important;
  }
`;

const ButtonStyled = styled(Button)`
  height: 40px !important;
  padding: 6.4px 15px !important;
  font-size: 17px !important;
  border-radius: 4px !important;
  margin-right: 5px !important;
  margin-top: 7px !important;
`;

const ConfirmDeletePermissionModal = ({visible, defaultValue, handleSubmit, onClose, onRefesh}) => {
  const onSubmit = async () => {
    try {
      await handleSubmit(defaultValue?.user_name, 'UNPERMISSION', defaultValue?.department_id);
      onClose();
      onRefesh();
    } catch (_) {
      console.log(_);
    }
  };

  return (
    <ModalBaseStyled visible={visible}>
      <Title style={{textAlign: 'center'}} level={4}>
        Bạn chắc chắn xoá quyền truy cập của người này?
      </Title>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <ButtonStyled size="large" onClick={onClose}>
          Huỷ bỏ
        </ButtonStyled>
        <ButtonStyled size="large" type="primary" onClick={onSubmit}>
          Xác nhận
        </ButtonStyled>
      </div>
    </ModalBaseStyled>
  );
};

ConfirmDeletePermissionModal.propTypes = {
  visible: PropTypes.bool,
  defaultValue: PropTypes.object,
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

ConfirmDeletePermissionModal.defaultProps = {
  visible: false,
  defaultValue: {},
  onRefresh: () => {},
  onClose: () => {},
};

export default ConfirmDeletePermissionModal;
