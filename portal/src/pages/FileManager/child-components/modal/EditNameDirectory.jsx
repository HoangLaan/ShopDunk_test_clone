import ModalBase from 'pages/FileManager/common/ModalBase';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Select, Button, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
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

const EditNameDirectoryModal = ({ isTypeDocument, visible, defaultValue, dataColumn, onClose, onRefesh, onChange }) => {
  const { reset, handleSubmit, register, watch, setValue, errors } = useForm();

  const dispatch = useDispatch();
  const { companyList } = useSelector((state) => state.fileManager);
  const { parentFolder } = dataColumn;
  useEffect(() => {
    if (isTypeDocument) dispatch(fileManager.getCompany());
  }, [dispatch, isTypeDocument]);

  useEffect(() => {
    register('document_type_name');
    register('company_select');
    register('directory_name');
    register('file_name');
  }, [register]);

  useEffect(() => {
    reset({
      directory_name: defaultValue?.directory_name,
      company_select: {
        value: defaultValue?.company_id,
        label: defaultValue?.company_name,
      },
      file_name: defaultValue?.file_name,
      document_type_name: defaultValue?.document_type_name,
    });
  }, [reset, defaultValue]);

  const onSubmit = async () => {
    try {
      let params = {};
      let valueCallApi;
      if (Boolean(defaultValue?.is_file)) {
        params = {
          file_id: defaultValue?.file_id,
          file_name: watch('file_name'),
          directory_id: parentFolder?.directory_id,
          document_type_id: parentFolder?.document_type_id,
        };
        valueCallApi = await dispatch(fileManager.updateFile(params));
      } else if (Boolean(defaultValue?.is_directory)) {
        params = {
          directory_id: defaultValue?.directory_id,
          directory_name: watch('directory_name'),
          parent_id: parentFolder?.directory_id,
          document_type_id: defaultValue?.document_type_id,
        };
        valueCallApi = await dispatch(fileManager.updateDir(params));
      }
      if (isTypeDocument) {
        const params = {
          document_type_name: watch('document_type_name'),
          document_type_id: defaultValue?.document_type_id,
          company_id: watch('company_select')?.value,
        };
        valueCallApi = await dispatch(fileManager.updateDocument(params));
      }
      onChange({
        file_name: valueCallApi?.name_file_new ?? defaultValue?.file_name,
        directory_name: valueCallApi?.name_dir_new ?? defaultValue?.directory_name,
        document_type_name: valueCallApi?.name_document_type_new ?? defaultValue?.document_type_name,
      });

      onClose();
      onRefesh();
    } catch (_) {}
  };

  return (
    <ModalBaseStyled visible={visible}>
      <Title level={5}>Đổi tên {isTypeDocument ? 'loại tài liệu' : 'thư mục'}</Title>
      <InputStyled
        value={
          (Boolean(defaultValue?.is_file)
            ? watch('file_name')
            : Boolean(defaultValue?.is_directory)
            ? watch('directory_name')
            : watch('document_type_name')) || ''
        }
        onChange={(e) => {
          if (Boolean(defaultValue?.is_file)) {
            setValue('file_name', e.target.value);
          } else if (Boolean(defaultValue?.is_directory)) {
            setValue('directory_name', e.target.value);
          } else {
            setValue('document_type_name', e.target.value);
          }
        }}
      />
      {isTypeDocument && (
        <SelectStyled
          className='MuiPaper-filter__custom--select'
          placeholder='Chọn công ty áp dụng'
          value={watch('company_select')}
          onChange={(e) => setValue('company_select', e)}
          options={
            companyList.map((e) => {
              return {
                value: e?.id,
                label: e?.name,
              };
            }) || []
          }
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ButtonStyled size='large' onClick={onClose}>
          Huỷ bỏ
        </ButtonStyled>
        <ButtonStyled size='large' type='primary' onClick={handleSubmit(onSubmit)}>
          Đổi tên
        </ButtonStyled>
      </div>
    </ModalBaseStyled>
  );
};

EditNameDirectoryModal.propTypes = {
  visible: PropTypes.bool,
  defaultValue: PropTypes.object,
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

EditNameDirectoryModal.defaultProps = {
  visible: false,
  defaultValue: {},
  onRefresh: () => {},
  onClose: () => {},
};

export default EditNameDirectoryModal;
