import React, { useState } from 'react';
import moment from 'moment';
import { notification, Alert } from 'antd';
import { useDropzone } from 'react-dropzone';

import { downloadTemplateCashFlow, importExcelCashFlow } from 'services/cash-flow.service';

export default function ImportExcel({ onClose, handleSetErrorImport }) {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({ multiple: false });
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
      const data = await importExcelCashFlow(currentFile);
      const { import_total, import_errors } = data;

      if (import_errors.length) {
        handleSetErrorImport({ error: import_errors, total: import_total });
      } else {
        notification.success({ message: 'Tập tin tải lên thành công!' });
        onClose(true);
      }
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`${statusText || message || 'Lỗi tải lên tập tin!'}`].concat(errors || []).join('.');
      setErrorUpload(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async (e) => {
    e.preventDefault();

    await downloadTemplateCashFlow()
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const configDate = moment().format('DDMMYYYY_HHmmss');
        link.setAttribute('download', `Mau_import_danh_sach_dong_tien${configDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        notification.error({
          message: 'Đã xảy ra lỗi vui lòng thử lại',
        });
      })
      .finally(() => {});
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
            <p>Chuyển đổi file nhập dưới dạng .XLSX trước khi tải dữ liệu.</p>
            <p>
              Tải file mẫu danh sách tại{' '}
              <a href='/' onClick={handleDownloadTemplate}>
                tại đây
              </a>{' '}
              (file excel danh sách sản phẩm mẫu)
            </p>
          </div>
          <div className='bw_import_file'>
            {uploading ? (
              'Đang tải lên ...'
            ) : (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p className='dropzone-product-upload text-center font-weight-bold'>
                    <i class='fa fa-upload mr-1'></i>Kéo thả file hoặc tải lên từ thiết bị
                  </p>
                </div>
                {acceptedFiles[0] ? (
                  <div style={{ color: 'red' }} className='font-weight-bold'>
                    Tập tin: {acceptedFiles[0]?.path}
                  </div>
                ) : null}
              </section>
            )}
          </div>
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
