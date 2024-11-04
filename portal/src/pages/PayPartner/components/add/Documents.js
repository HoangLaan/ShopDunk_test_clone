import React, { useState } from 'react';
import { showToast } from 'utils/helpers';
import { useAuth } from 'context/AuthProvider';
import moment from 'moment';
import { useFormContext } from 'react-hook-form';
import { Progress } from 'antd';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';

import { cdnPath, getExtension } from 'utils/index';

import { ToastStyle } from 'pages/PayPartner/utils/constants';
import { uploadPayPartnerFile } from 'services/pay-partner.service';

const Documents = ({ disabled, onRefesh }) => {
  const { user } = useAuth();
  const methods = useFormContext();
  const dispatch = useDispatch();
  const { watch, setValue } = methods;
  const [progress, setProgress] = useState(0);
  const handleRemoveFile = (idx, e) => {
    e.preventDefault();
    if (!disabled) {
      let _files = watch('documents');
      const { file_module_id, file_id } = _files[idx];
      // Nếu là file trước đó thì confirm
      if (file_module_id && file_id) {
        dispatch(
          showConfirmModal(['Bạn có chắc chắn muốn tập tin đang chọn?'], async () => {
            await handleDeleteFile(idx);
            onRefesh();
          }),
        );
      } else {
        _files.splice(idx, 1);
        methods.setValue('documents', _files || []);
      }
    }
  };

  const handleDeleteFile = async (idx) => {
    if (!disabled) {
      try {
        let _files = watch('documents');
        _files.splice(idx, 1);
        setValue('documents', _files);
      } catch (err) {
        window._$g.dialogs.alert(window._$g._(`Xóa tập tin không thành công. Mã lỗi ${err.message || err}`));
      }
    }
  };

  const handleUploadFile = (e) => {
    const files = Object.values(e.target.files);
    if (
      files.findIndex((_) => !_.name) !== -1 ||
      files.findIndex((_) => !_.name.match(/\.(doc|docx|pdf|xlsx|xls|jpg|png)$/i)) !== -1
    ) {
      showToast.error(`Tập tin tải lên không đúng định dạng.`, ToastStyle);
      return;
    }
    if (files && files.length > 0) {
      uploadPayPartnerFile(files[0], onUploadProgress)
        .then((response) => {
          let file = {};
          let full_name =
            user.user_name === 'administrator' ? 'Administrator account' : `${user.user_name} - ${user.full_name}`;
          let currentTime = new Date().getTime();
          currentTime = moment(currentTime).format('hh:mm DD/MM/YYYY');
          file.created_date = currentTime;
          file.created_user = full_name;
          file.file_name = response.file_name;
          file.file_size = files[0].size || 0;
          file.file_mime = files[0].type || '';
          file.file_ext = getExtension(files[0].name || '');
          file.file_name_path = response.file_url;
          file.is_delete = true;
          methods.setValue('documents', [file]);
        })
        .catch((error) => {
          showToast.error(error, ToastStyle);
        });
    }
  };

  const onUploadProgress = (event) => {
    const percent = Math.floor((event.loaded / event.total) * 100);
    setProgress(percent);
    if (percent === 100) {
      setTimeout(() => setProgress(0), 100);
    }
  };
  return (
    <div className='bw_col_12'>
      {!disabled && (
        <label className='bw_choose_image_banner' style={{ width: '230px', height: '50px', background: '#119480' }}>
          <input field={`path`} onChange={(e) => handleUploadFile(e)} type='file' disabled={disabled} />
          <span style={{ color: '#fff', fontSize: '17px' }}>
            <i className='fi fi-rr-upload' style={{ paddingRight: 5 }} />
          </span>
        </label>
      )}
      {progress > 0 && <Progress percent={progress} />}

      {watch('documents') && watch('documents').length > 0
        ? watch('documents').map((item, idx) => {
            return (
              <div className='bw_mt_1' key={idx}>
                <a className='bw_green file_name_custom'>
                  <i className='fi fi-rr-cloud-download-alt' style={{ paddingRight: 5 }} />
                </a>

                <a className='bw_green' target={'_blank'} href={cdnPath(item?.file_name_path)}>
                  {item.file_name}
                </a>
                {!disabled && (
                  <span style={{ cursor: 'pointer' }} onClick={(e) => handleRemoveFile(idx, e)}>
                    <i className='fi fi-rr-trash' style={{ paddingLeft: 5 }} />
                  </span>
                )}
              </div>
            );
          })
        : null}
    </div>
  );
};

export default Documents;
