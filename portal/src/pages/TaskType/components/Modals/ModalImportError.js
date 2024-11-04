import React from 'react';
import TableImportError from '../Tables/TableImportError';
import { useTaskTypeContext } from 'pages/TaskType/utils/context';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import { MODAL } from 'pages/TaskType/utils/constants';

function ModalImportError() {
  const { isOpenModalImportError, openModalImportError, openModalImport } = useTaskTypeContext()

  return isOpenModalImportError? (
    <ModalPortal
      wrapperId={MODAL.IMPORT_ERROR}
      title='Lỗi nhập loại công việc'
      width={800}
      onClose={() => {
        openModalImportError(false)
        openModalImport(true)
      }}
      onConfirm={() => openModalImportError(false)}>
        <TableImportError />
      </ModalPortal>
  ): null;
}

export default ModalImportError;
