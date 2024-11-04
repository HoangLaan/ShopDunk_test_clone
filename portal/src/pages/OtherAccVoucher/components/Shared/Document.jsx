import React from 'react';
import { cdnPath } from 'utils/index';
import { DownloadOutlined, LinkOutlined } from '@ant-design/icons';

const DocumentItem = ({ disabled, document, handleRemoveFile, handleDowloadFile }) => {
  return (
    <div>
      <div className='bw_flex bw_justify_content_center bw_align_items_center' style={{ gap: '6px' }}>
        <LinkOutlined />
        <a className='bw_green' target={'_blank'} href={cdnPath(document?.attachment_url)} rel='noreferrer'>
          {document?.attachment_name}
        </a>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => {
            !disabled && handleDowloadFile();
          }}>
          <DownloadOutlined />
        </span>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => {
            !disabled && handleRemoveFile();
          }}>
          <i className='fi fi-rr-trash bw_flex bw_justify_content_center bw_align_items_center' />
        </span>
      </div>
    </div>
  );
};

export default DocumentItem;
