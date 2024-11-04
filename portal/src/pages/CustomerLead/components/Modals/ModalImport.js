import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

import CustomerLeadService from 'services/customer-lead.service';
import { useCustomerLeadContext } from 'pages/CustomerLead/utils/context';
import { createDownloadFile, showToast } from 'utils/helpers';
import { MODAL } from 'pages/CustomerLead/utils/constants';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';

function ModalImport() {
  const methods = useForm();
  const { onOpenModalImport, onOpenModalImportError, refresh } = useCustomerLeadContext();

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone();
  const [uploading, setUploading] = useState(false);

  const handleDownloadTemplate = async (e) => {
    e.preventDefault();
    try {
      CustomerLeadService.getTemplateImport()
        .then((response) => createDownloadFile(response?.data, 'mau-nhap-khach-hang-tiem-nang.xlsx'))
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
      const data = await CustomerLeadService.importExcel(currentFile);
      const { import_data, import_errors } = data;
      onOpenModalImport(false)
      if (import_errors?.length) {
        onOpenModalImportError(true, import_errors, import_data?.length);
        onOpenModalImport(false);
      } else {
        refresh();
        showToast.success('Nhập dữ liệu khách hàng thành công');
      }
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
        title='Nhập excel khách hàng tiềm năng'
        onClose={() => onOpenModalImport(false)}
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
            (file excel danh sách khách năng tiềm năng mẫu).
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
