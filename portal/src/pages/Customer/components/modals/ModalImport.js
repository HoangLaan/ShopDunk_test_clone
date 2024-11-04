import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import { useCustomerContext } from 'pages/Customer/utils/context';
import { createDownloadFile, showToast } from 'utils/helpers';
import { MODAL } from 'pages/Customer/utils/constants';
import { getTemplateImport, importExcel } from 'services/customer.service';

function ModalImport({ onRefresh }) {
  const methods = useForm();
  const { openModalImport, openModalImportError } = useCustomerContext();

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone();
  const [uploading, setUploading] = useState(false);

  const handleDownloadTemplate = async (e) => {
    e.preventDefault();
    try {
      getTemplateImport()
        .then((response) => createDownloadFile(response?.data, 'mau-nhap-khach-hang.xlsx'))
        .catch(() => {});
    } catch (error) {}
  };

  const handleImportExcel = async () => {
    let currentFile = acceptedFiles[0];
    if (!currentFile) {
      showToast.error('Vui lòng chọn tập tin tải lên');
      return;
    } else if (!currentFile?.name || !currentFile?.name.match(/\.(xlsx)$/i)) {
      showToast.error('Tập tin tải lên không đúng định dạng');
      return;
    }
    setUploading(true);
    try {
      const data = await importExcel(currentFile);
      const { import_data, import_errors } = data;
      if (import_errors?.length) {
        openModalImportError(true, import_errors, import_data?.length);
      } else {
        onRefresh()
        showToast.success('Nhập dữ liệu khách hàng thành công');
      }
      openModalImport(false)
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <ModalPortal
        wrapperId={MODAL.IMPORT}
        title='Nhập excel khách hàng'
        onClose={() => openModalImport(false)}
        onConfirm={handleImportExcel}>
        <div className='bw_note'>
          <h3>Chú ý</h3>
          <p>Các mục đánh dấu * bắt buộc khai báo.</p>
          <p>Chuyển đổi file nhập dưới dạng .XLSX trước khi tải dữ liệu.</p>
          <p>
            Tải file mẫu danh sách tại{' '}
            <a href='/#' onClick={handleDownloadTemplate}>
              tại đây
            </a>{' '}
            (file excel danh sách khách hàng).
          </p>
        </div>
        <label className='bw_import_file'>
          {uploading ? (
            'Đang tải lên ...'
          ) : (
            <section>
              <div {...getRootProps({ onClick: (e) => e.stopPropagation() })}>
                <input {...getInputProps()} />
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
      </ModalPortal>
    </FormProvider>
  );
}

export default ModalImport;
