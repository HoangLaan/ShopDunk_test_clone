import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

import { useTaskTypeContext } from 'pages/TaskType/utils/context';
import TaskTypeService from 'services/task-type.service';
import { showToast } from 'utils/helpers';
import { MODAL } from 'pages/TaskType/utils/constants';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import { createDownloadFile } from 'pages/TaskType/utils/utils';

function ModalImport() {
  const methods = useForm();
  const { openModalImport, openModalImportError, refreshTaskType } = useTaskTypeContext();

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone();
  const [uploading, setUploading] = useState(false);

  const handleDownloadTemplate = async (e) => {
    e.preventDefault();
    TaskTypeService.getTemplateImport()
      .then((response) => createDownloadFile(response?.data, 'task-type-template-import.xlsx'))
      .catch(() => {});
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
      const data = await TaskTypeService.importExcel(currentFile);
      const { import_data, import_errors } = data;
      if (import_errors?.length) {
        openModalImportError(true, import_errors, import_data?.length);
      } else {
        refreshTaskType();
        showToast.success('Nhập dữ liệu loại công việc thành công');
      }
      openModalImport(false);
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
        title='Nhập excel loại công việc'
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
            (file excel danh sách loại công việc mẫu).
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
