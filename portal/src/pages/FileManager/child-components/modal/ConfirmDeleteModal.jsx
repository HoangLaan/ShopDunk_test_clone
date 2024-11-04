import ModalBase from 'pages/FileManager/common/ModalBase';
import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Button, Input } from 'antd';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import fileManager from 'pages/FileManager/actions/file-manager';

const { Title } = Typography;
const ModalBaseStyled = styled(ModalBase)`
  .ant-modal-header {
    display: none !important;
  }
`;

const InputStyled = styled(Input)`
  padding: 5px;
  font-size: 18px;
`;

const ButtonStyled = styled(Button)`
  height: 40px !important;
  padding: 6.4px 15px !important;
  font-size: 17px !important;
  border-radius: 4px !important;
  margin-right: 5px !important;
  margin-top: 7px !important;
`;

const ConfirmDeleteModal = ({ isTypeDocument, visible, defaultValue, onClose, onRefesh }) => {
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    try {
      if (Boolean(defaultValue?.is_directory)) {
        await dispatch(fileManager.deleteItems('dir', defaultValue?.directory_id));
      }
      if (Boolean(defaultValue?.is_file)) {
        await dispatch(fileManager.deleteItems('file', defaultValue?.file_id));
      }
      if(Boolean(isTypeDocument)){
        await dispatch(fileManager.deleteItems('type-document', defaultValue?.document_type_id));
      }
      onClose();
      onRefesh();
    } catch (_) {
      console.log(_);
    }
  };

  return (
    <ModalBaseStyled visible={visible}>
      <Title style={{ textAlign: 'center' }} level={4}>
        {isTypeDocument && "Xóa loại tài liệu này sẽ xóa tất cả thư mục và tài liệu bên trong"}
        {defaultValue?.is_directory == 1 && "Xóa thư mục này sẽ xóa tất cả thư mục và tài liệu bên trong"}
        {defaultValue?.is_file == 1 && "Bạn chắc chắn muốn xoá ?"}
      </Title>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ButtonStyled size="large" onClick={onClose}>
          Huỷ bỏ
        </ButtonStyled>
        <ButtonStyled size="large" type="primary" onClick={handleSubmit}>
          Xác nhận
        </ButtonStyled>
      </div>
    </ModalBaseStyled>
  );
};

ConfirmDeleteModal.propTypes = {
  visible: PropTypes.bool,
  defaultValue: PropTypes.object,
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

ConfirmDeleteModal.defaultProps = {
  visible: false,
  defaultValue: {},
  onRefresh: () => {},
  onClose: () => {},
};

export default ConfirmDeleteModal;
