import React, { useState } from 'react';
import moment from 'moment';
import { notification, Alert } from 'antd';
import { useDropzone } from 'react-dropzone';

// Service
import { downloadTemplateTaskWorkflow, importExcelTaskWorkflow } from 'services/task-work-flow.service';
import Modal from 'components/shared/Modal/index';

export default function ModalImportExcel({ open, onClose, handleSetErrorImport }) {
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
      const data = await importExcelTaskWorkflow(currentFile);
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

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplateTaskWorkflow().then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const configDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `MauFileImportBuocXuLy_${configDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
    } catch (error) {
      notification.error({ message: error.message || 'Lỗi tải tập tin.' });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      header='Import Excel'
      footer={
        <button disabled={uploading} className='bw_btn bw_btn_success' onClick={handleImportExcel}>
          <span className='fi fi-rr-check'></span> Nhập file
        </button>
      }>
      <div>
        {errorUpload && <Alert closable className='bw_mb_2' type='error' message={errorUpload} />}
        <div className='bw_note'>
          <h3>Chú ý</h3>
          <p>Các mục đánh dấu * bắt buộc khai báo.</p>
          <p>Chuyển đổi file nhập dưới dạng .XLS trước khi tải dữ liệu.</p>
          <p>
            Tải file mẫu danh sách tại{' '}
            <a href='javascript:void(0)' onClick={handleDownloadTemplate}>
              tại đây
            </a>{' '}
            (file excel danh sách sản phẩm mẫu)
          </p>
        </div>
        <label className='bw_import_file'>
          {uploading ? (
            'Đang tải lên ...'
          ) : (
            <section>
              <div {...getRootProps()}>
                <input
                  {...getInputProps()}
                  accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                />
                <p className='dropzone-product-upload text-center font-weight-bold'>
                  <i className='fa fa-upload mr-1'></i>Kéo thả file hoặc tải lên từ thiết bị
                </p>
              </div>
              {acceptedFiles[0] ? (
                <div style={{ color: 'red' }} className='font-weight-bold'>
                  Tập tin: {acceptedFiles[0]?.path}
                </div>
              ) : null}
            </section>
          )}
        </label>
      </div>
    </Modal>
  );
}
