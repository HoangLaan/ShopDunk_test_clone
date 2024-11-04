import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import { useCustomerContext } from 'pages/Customer/utils/context';
import { MODAL } from 'pages/Customer/utils/constants';
import TableSelectRelatives from '../tables/TableSelectRelatives';

function ModalAddRelatives() {
  const methods = useForm();
  const { openModalRelatives } = useCustomerContext();

  const onConfirmModal = () => {
    document.getElementById('trigger-delete')?.click();
    openModalRelatives(false);
  };

  return (
    <FormProvider {...methods}>
      <ModalPortal
        wrapperId={MODAL.ADD_RELATIVES}
        title='Chọn người thân'
        width={800}
        onClose={() => openModalRelatives(false)}
        onConfirm={onConfirmModal}>
        <TableSelectRelatives />
      </ModalPortal>
    </FormProvider>
  );
}

export default ModalAddRelatives;
