import React from 'react';
import { useCustomerLeadContext } from 'pages/CustomerLead/utils/context';
import ModalPortal from './ModalPortal';
import TableImportError from '../Tables/TableImportError';
import { MODAL } from 'pages/CustomerLead/utils/constants';

function ModalImportError() {
  const { openModalImportError, onOpenModalImportError } = useCustomerLeadContext();

  return openModalImportError? (
    <ModalPortal
      wrapperId={MODAL.IMPORT_ERROR}
      title='Lỗi nhập khách hàng tiềm năng'
      width={800}
      onClose={() => onOpenModalImportError(false)}
      onConfirm={() => onOpenModalImportError(false)}>
        <TableImportError />
      </ModalPortal>
  ): null;
}

export default ModalImportError;
