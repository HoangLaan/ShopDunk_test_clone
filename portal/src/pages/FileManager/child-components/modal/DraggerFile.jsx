import React, {useState} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {UploadOutlined} from '@ant-design/icons';
import {Upload, Button} from 'antd';
import {MAX_SIZE} from 'pages/FileManager/utils/constants';
import {showToast, toastrShow} from 'utils/helpers';
const {Dragger} = Upload;

const Wrapper = styled.div`
  .footer {
    display: flex;
    justify-content: flex-end;
  }
`;

const ButtonStyled = styled(Button)`
  height: 40px !important;
  padding: 6.4px 15px !important;
  font-size: 17px !important;
  border-radius: 4px !important;
  margin-right: 5px !important;
  margin-top: 7px !important;
  .ant-btn-loading-icon {
    svg {
      margin-top: -6px;
    }
    margin-top: -10px !important;
  }
`;

const DraggerStyled = styled(Dragger)`
  width: 100% !important;
  height: 98px !important;
  background: #fafafa;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  .ant-upload {
    padding: 0px !important;
  }
  .ant-upload-list-item-info {
    padding: 0px !important;
  }
  .ant-upload-drag-container {
    display: flex !important;
    justify-content: center !important;
    justify-content: space-evenly !important;
    align-items: center;
    height: 100%;
  }
  .ant-upload-text-icon {
    font-size: 9px;
  }
`;

const DraggerFile = ({onSubmit, loading}) => {
  const [fileList, setFileList] = useState([]);

  const handleUpload = () => {
    onSubmit(fileList);
  };

  const props = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      if (file?.size <= MAX_SIZE) {
        setFileList(prev => [...prev, file]);
      } else {
        showToast.error(`File không vượt quá ${MAX_SIZE / 1000000000} Gb`);
      }
      return false;
    },
    multiple: true,
    fileList,
  };

  return (
    <Wrapper>
      <DraggerStyled {...props}>
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <div>
          <p className="ant-upload-text">Kéo thả file của bạn hoặc click để chọn file của bạn</p>
          <p className="ant-upload-hint">Đuôi .pdf, .doc, .docx, .xls, .xlsx, .ppt....</p>
        </div>
      </DraggerStyled>
      <div className="footer">
        <ButtonStyled
          disabled={fileList.length === 0}
          loading={loading}
          size="large"
          type="primary"
          onClick={handleUpload}>
          {loading ? 'Đang tải lên' : 'Tải lên'}
        </ButtonStyled>
      </div>
    </Wrapper>
  );
};

DraggerFile.propTypes = {
  onSubmit: PropTypes.func,
};

DraggerFile.defaultProps = {
  onSubmit: () => {},
};

export default DraggerFile;
