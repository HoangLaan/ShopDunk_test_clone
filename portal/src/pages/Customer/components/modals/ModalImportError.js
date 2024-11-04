import React from 'react';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import { useCustomerContext } from 'pages/Customer/utils/context';
import { MODAL } from 'pages/Customer/utils/constants';
import TableImportError from '../tables/TableImportError';

function ModalImportError() {
  const { isOpenModalImportError, openModalImportError } = useCustomerContext();

  return isOpenModalImportError? (
    <ModalPortal
      wrapperId={MODAL.IMPORT_ERROR}
      title='Lỗi nhập khách hàng tiềm năng'
      width={800}
      onClose={() => openModalImportError(false)}
      onConfirm={() => openModalImportError(false)}>
        <TableImportError />
      </ModalPortal>
  ): null;
}

export default ModalImportError;
