import ModalBase from 'pages/FileManager/common/ModalBase';
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Typography, Button, Input, Select} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {useForm} from 'react-hook-form';
import styled from 'styled-components';
import fileManager from 'pages/FileManager/actions/file-manager';

const {Title} = Typography;
const ModalBaseStyled = styled(ModalBase)`
  .ant-modal-header {
    display: none !important;
  }
`;

const InputStyled = styled(Input)`
  padding: 5px;
  font-size: 16px;
  border-radius: 5px;
`;

const ButtonStyled = styled(Button)`
  height: 40px !important;
  padding: 6.4px 15px !important;
  font-size: 17px !important;
  border-radius: 4px !important;
  margin-right: 5px !important;
  margin-top: 7px !important;
  &:last-child {
    margin-right: 0px !important;
  }
`;

const SelectStyled = styled(Select)`
  margin-top: 10px;
`;

const CreateDocumentModal = ({visible, defaultValue, onClose, onRefesh}) => {
  const {reset, handleSubmit, register, watch, setValue} = useForm();

  const dispatch = useDispatch();
  const {companyList} = useSelector(state => state.fileManager);

  useEffect(() => {
    dispatch(fileManager.getCompany());
  }, [dispatch]);

  useEffect(() => {
    register('document_type_name');
    register('company_select');
  }, [register]);

  useEffect(() => {
    reset({
      company_select: {
        value: companyList[0]?.id,
        label: companyList[0]?.name,
      },
    });
  }, [companyList]);

  const onSubmit = async () => {
    try {
      const params = {
        document_type_name: watch('document_type_name'),
        company_id: [watch('company_select').value],
        is_active: 1,
        is_managed_document: 1,
      };
      await dispatch(fileManager.createDocument(params));
      onClose();
      onRefesh();
    } catch (_) {}
  };

  return (
    <ModalBaseStyled visible={visible}>
      <Title level={5}>Thêm loại tài liệu</Title>
      <InputStyled
        placeholder="Đặt tên loại tài liệu"
        value={watch('document_type_name') || ''}
        onChange={e => setValue('document_type_name', e.target.value)}
      />
      <SelectStyled
        className="MuiPaper-filter__custom--select"
        placeholder="Chọn công ty áp dụng"
        value={watch('company_select')}
        onChange={e => setValue('company_select', e)}
        options={
          companyList.map(e => {
            return {
              value: e?.id,
              label: e?.name,
            };
          }) || []
        }
      />
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <ButtonStyled size="large" onClick={onClose}>
          Huỷ bỏ
        </ButtonStyled>
        <ButtonStyled size="large" type="primary" onClick={handleSubmit(onSubmit)}>
          Tạo mới
        </ButtonStyled>
      </div>
    </ModalBaseStyled>
  );
};

CreateDocumentModal.propTypes = {
  visible: PropTypes.bool,
  defaultValue: PropTypes.object,
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

CreateDocumentModal.defaultProps = {
  visible: false,
  defaultValue: {},
  onRefresh: () => {},
  onClose: () => {},
};

export default CreateDocumentModal;
