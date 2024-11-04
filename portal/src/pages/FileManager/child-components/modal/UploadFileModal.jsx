import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import fileManager from 'pages/FileManager/actions/file-manager';
import styled from 'styled-components';
import ModalBase from 'pages/FileManager/common/ModalBase';
import DraggerFile from 'pages/FileManager/child-components/modal/DraggerFile';
import { useDispatch } from 'react-redux';
//import {FormGroup, Label} from 'reactstrap';
import { Progress } from 'antd';

const ModalBaseStyled = styled(ModalBase)`
  .ant-modal-header {
    display: none !important;
  }
`;

const ProgressStyled = styled(Progress)`
  .ant-progress-outer {
    padding-right: 0px !important;
  }
  .ant-progress-text {
    display: none;
  }
`;

const UploadFileModal = ({ visible, dataColumn, onRefesh, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);

  const onUploadProgress = (event) => {
    const percent = Math.floor((event.loaded / event.total) * 100);
    setPercent(percent);
  };

  const handleOk = useCallback(
    async (file) => {
      const params = dataColumn?.parentFolder;
      params.is_share_all = 0;
      params.is_active = 1;
      params.file_name = [];
      setLoading(true);
      try {
        await dispatch(fileManager.uploadFile({ files: file, data: JSON.stringify(params) }, onUploadProgress)).then(
          () => dispatch(fileManager.uploadFileSuccess({ message: "Tải lên file thành công"}))
        ).catch(error => dispatch(fileManager.updateFileFailure({message: "Tải lên file thất bại"})));
        setLoading(false);
        await onClose();
        await onRefesh();
      } catch (e) {
        console.log(e)
    }
    },
    [dataColumn, dispatch, onClose, onRefesh],
  );

  return (
    <ModalBaseStyled showHeader title='Upload tài liệu' visible={visible} onClose={onClose}>
      {!loading && (
        <>
          <span for='inputValue' className='mr-sm-2'>
            Chọn file
          </span>
          <DraggerFile onSubmit={(file) => handleOk(file)} loading={loading} />
        </>
      )}
      {loading && (
        <div>
          <span>Đang tải lên ({percent}%)</span>
          <ProgressStyled percent={percent} status='active' />
        </div>
      )}
    </ModalBaseStyled>
  );
};

UploadFileModal.propTypes = {
  visible: PropTypes.bool,
  dataColumn: PropTypes.object,
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

UploadFileModal.defaultProps = {
  visible: false,
  dataColumn: {},
  onRefresh: () => {},
  onClose: () => {},
};

export default UploadFileModal;
