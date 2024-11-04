import React from 'react';
import TableImportError from '../Tables/TableImportError';
import { useBankUserContext } from 'pages/BankUser/utils/context';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import { MODAL } from 'pages/BankUser/utils/constants';

function ModalImportError() {
  const { isOpenModalImportError, openModalImportError, openModalImport } = useBankUserContext()

  return isOpenModalImportError? (
    <ModalPortal
      wrapperId={MODAL.IMPORT_ERROR}
      title='Lỗi nhập tài khoản ngân hàng'
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
