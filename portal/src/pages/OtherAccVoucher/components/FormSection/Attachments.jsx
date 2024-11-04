import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Progress } from 'antd';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';

import { cdnPath, getExtension } from 'utils/index';

import BWAccordion from 'components/shared/BWAccordion/index';
import { uploadReceiveSlipFile, deleteFile } from 'services/receive-slip.service';
import { showToast } from 'utils/helpers';
import styled from 'styled-components';

const UploadButton = styled.label`
  width: fit-content;
  height: fix-content;
  height: 40px;
  padding: 10px;
  transition: all 0.3s;
  :hover {
    background-color: #ccc;
  }
`;

const Attachments = ({ disabled, onRefresh, title }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const { watch, setValue } = methods;
  const [progress, setProgress] = useState(0);

  const handleRemoveFile = (idx, e) => {
    e.preventDefault();
    if (!disabled) {
      let _files = watch('attachment_list');
      const { file_module_id, file_id } = _files[idx];
      // Nếu là file trước đó thì confirm
      if (file_module_id && file_id) {
        dispatch(
          showConfirmModal(['Bạn có chắc chắn muốn xóa tập tin đang chọn?'], async () => {
            await handleDeleteFile(idx).then(() => onRefresh());
          }),
        );
      } else {
        _files.splice(idx, 1);
        methods.setValue('attachment_list', _files || []);
        methods.setValue('attachment_count', _files.length);
      }
    }
  };

  const handleDeleteFile = async (idx) => {
    if (!disabled) {
      try {
        let _files = watch('attachment_list');
        const { file_module_id, file_id } = _files[idx];
        await deleteFile({ file_id, file_module_id });
        _files.splice(idx, 1);
        setValue('receiveslip_files', _files);
      } catch (err) {
        window._$g.dialogs.alert(window._$g._(`Xóa tập tin không thành công. Mã lỗi ${err.message || err}`));
      }
    }
  };

  const handleUploadFile = async (e) => {
    const files = Object.values(e.target.files);
    if (
      files.findIndex((_) => !_.name) !== -1 ||
      files.findIndex((_) => !_.name.match(/\.(doc|docx|pdf|xlsx|xls|jpg|png)$/i)) !== -1
    ) {
      return showToast.error('Tập tin tải lên không đúng định dạng.');
    }
    const attachmentList = [];
    if (files && files.length > 0) {
      for (let file of files) {
        await uploadReceiveSlipFile(file, onUploadProgress)
          .then((response) => {
            file.attachment_path = response.attachment_path;
            file.attachment_name = response.attachment_name;
            file.file_name = file.name || '';
            file.file_size = file.size || 0;
            file.file_mime = file.type || '';
            file.file_ext = getExtension(file.name || '');
            attachmentList.push(file);
          })
          .catch((error) => {
            showToast.error(error.message || 'Có lỗi xảy ra !');
          });
      }
    }
    let _files = watch('attachment_list') || [];
    methods.setValue('attachment_list', _files.concat(attachmentList));
    methods.setValue('attachment_count', _files.concat(attachmentList).length);
  };

  const onUploadProgress = (event) => {
    const percent = Math.floor((event.loaded / event.total) * 100);
    setProgress(percent);
    if (percent === 100) {
      setTimeout(() => setProgress(0), 100);
    }
  };
  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <UploadButton className='bw_choose_image_banner'>
          <input field={`path`} onChange={(e) => handleUploadFile(e)} type='file' multiple disabled={disabled} />
          <span style={{ color: '#333', fontSize: '1rem' }}>
            <i className='fi fi-rr-upload' style={{ paddingRight: 5 }} />
            Thêm mới tập tin
          </span>
        </UploadButton>
        {progress > 0 && <Progress percent={progress} />}

        {watch('attachment_list') && watch('attachment_list').length > 0
          ? watch('attachment_list').map((item, idx) => {
              return (
                <div className='bw_mt_1' key={idx}>
                  <a className='bw_green file_name_custom'>
                    <i className='fi fi-rr-cloud-download-alt' style={{ paddingRight: 5 }} />
                  </a>
                  <a className='bw_green' target={'_blank'} href={cdnPath(item?.attachment_path)}>
                    {item?.attachment_name}
                  </a>
                  {
                    <span style={{ cursor: 'pointer' }} onClick={(e) => handleRemoveFile(idx, e)}>
                      <i className='fi fi-rr-trash' style={{ paddingLeft: 5 }} />
                    </span>
                  }
                </div>
              );
            })
          : null}
      </div>
    </BWAccordion>
  );
};

export default Attachments;
