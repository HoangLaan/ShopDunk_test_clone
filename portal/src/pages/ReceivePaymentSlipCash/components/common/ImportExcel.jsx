import React, { useState } from 'react';
import moment from 'moment';
import { Alert } from 'antd';
import { useDropzone } from 'react-dropzone';

// Service
import { downloadTemplate, importExcel } from 'services/receive-slip.service';
import { showToast } from 'utils/helpers';

export default function ImportExcel({ onClose, handleImportDone }) {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone();
  const [uploading, setUploading] = useState(false);
  const [errorUpload, setErrorUpload] = useState(null);

  const handleImportExcel = async () => {
    let currentFile = acceptedFiles[0];
    if (!currentFile) {
      setErrorUpload('Vui lòng chọn tập tin tải lên.');
      return;
    } else if (!currentFile?.name || !currentFile?.name.match(/\.(xlsx)$/i)) {
      setErrorUpload('Tập tin tải lên không đúng định dạng.');
      return;
    }
    setUploading(true);
    setErrorUpload(null);
    try {
      const data = await importExcel(currentFile, 1);
      const { import_total, import_errors } = data;

      if (import_errors.length === 0) {
        showToast.success('Tập tin tải lên thành công!');
        onClose(true);
      } else {
        showToast.warning('Tập tin tải lên có lỗi xảy ra!');
      }

      handleImportDone({ error: import_errors, total: import_total });
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`${statusText || message || 'Lỗi tải lên tập tin!'}`].concat(errors || []).join('.');
      setErrorUpload(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplate().then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const configDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `MauFileImportPhieuThuChi_${configDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
    } catch (error) {
      showToast.error({ message: error.message || 'Lỗi tải tập tin.' });
    }
  };

  return (
    <div className='bw_modal bw_modal_open' id='bw_importExcel'>
      <div className='bw_modal_container bw_filter'>
        <div className='bw_title_modal'>
          <h3>Import Excel</h3>
          <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose}></span>
        </div>
        <div className='bw_main_modal'>
          {errorUpload && <Alert closable className='bw_mb_2' type='error' message={errorUpload} />}
          <div className='bw_note'>
            <h3>Chú ý</h3>
            <p>Các mục đánh dấu * bắt buộc khai báo.</p>
            <p>Chuyển đổi file nhập dưới dạng .XLS trước khi tải dữ liệu.</p>
            <p>
              Tải file mẫu danh sách tại{' '}
              <a href='javascript:void(0)' onClick={handleDownloadTemplate}>
                tại đây{' '}
              </a>
              (file excel danh sách thu chi)
            </p>
          </div>
          <label className='bw_import_file'>
            {uploading ? (
              'Đang tải lên ...'
            ) : (
              <section>
                <div {...getRootProps()} onClick={(e) => e.stopPropagation()}>
                  <input {...getInputProps()} />
                  <p className='dropzone-product-upload text-center font-weight-bold'>
                    <i class='fa fa-upload mr-1'></i>Kéo thả file hoặc tải lên từ thiết bị
                  </p>
                </div>
                {acceptedFiles[0] ? (
                  <div style={{ color: 'blue' }} className='font-weight-bold'>
                    Tập tin: {acceptedFiles[0]?.path}
                  </div>
                ) : null}
              </section>
            )}
          </label>
        </div>
        <div className='bw_footer_modal'>
          <button disabled={uploading} className='bw_btn bw_btn_success' onClick={handleImportExcel}>
            <span className='fi fi-rr-check'></span> Nhập file
          </button>
          <button type='button' className='bw_btn_outline bw_btn_outline_success' onClick={onClose}>
            <span className='fi fi-rr-refresh'></span>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
