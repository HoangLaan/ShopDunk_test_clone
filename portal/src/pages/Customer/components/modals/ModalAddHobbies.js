import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import { useCustomerContext } from 'pages/Customer/utils/context';
import { MODAL } from 'pages/Customer/utils/constants';
import FormHobbiesAdd from '../forms/FormHobbiesAdd';
import TableSelectHobbies from '../tables/TableSelectHobbies';

function ModalAddHobbies() {
  const methods = useForm();
  const { openModalHobbies } = useCustomerContext()

  const onConfirmModal = () => {
    document.getElementById('trigger-delete')?.click();
    openModalHobbies(false);
  };

  return (
    <FormProvider {...methods}>
      <ModalPortal
        wrapperId={MODAL.ADD_HOBBIES}
        title='Chọn sở thích'
        width={800}
        onClose={() => openModalHobbies(false)}
        onConfirm={onConfirmModal}>
          <FormHobbiesAdd />
          <TableSelectHobbies />
      </ModalPortal>
    </FormProvider>
  );
}

export default ModalAddHobbies;
