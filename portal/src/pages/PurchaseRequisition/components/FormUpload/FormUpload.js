import React, { useMemo } from 'react';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useFormContext } from 'react-hook-form';
import { cdnPath } from 'utils';
import { downloadFileUrl } from 'utils/helpers';
import usePageInformation from 'hooks/usePageInformation';

function FormUpload({ field = 'document_url', fieldName = 'document_name', className = 'bw_mt_1', ...restProps }) {
  const methods = useFormContext();
  const { disabled } = usePageInformation();

  const file = methods.watch(field);
  const fileName = methods.watch(fieldName);
  const fileList = useMemo(() => {
    if (file instanceof File) {
      return [
        {
          name: file?.name,
          status: 'done',
        },
      ];
    }
    if (file) {
      return [
        {
          name: fileName,
          url: cdnPath(file),
          status: 'done',
        },
      ];
    }
    return [];
  }, [file, fileName]);

  return (
    <div className={className}>
      <Upload
        fileList={fileList}
        onChange={({ fileList }) => {
          const file = fileList.length ? fileList.pop().originFileObj : null;
          methods.setValue(field, file);
        }}
        customRequest={() => {}}
        style={{'.ant-upload-list-item-actions': {display: 'none'} }}
        onPreview={({ url, name }) => downloadFileUrl(url, name)}
        {...restProps}
        className={disabled ? 'disabled_trash_icon' : ''}
        >
        {!disabled ? <Button icon={<UploadOutlined />}>Chọn tệp</Button> : null}
      </Upload>
    </div>
  );
}

export default FormUpload;
