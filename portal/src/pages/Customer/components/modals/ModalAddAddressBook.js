/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import AddressSelectAccordion from 'components/shared/AddressSelectAccordion/index';
import FormSection from 'components/shared/FormSection/index';

import { useCustomerContext } from 'pages/Customer/utils/context';
import { MODAL, GENDER } from 'pages/Customer/utils/constants';
import FormCustomerAddressBook from '../forms/FormCustomerAddressBook';
import usePageInformation from 'hooks/usePageInformation';
import { showToast } from 'utils/helpers';
import { createAddressBook } from 'services/customer.service';

const INIT_FORM = {
  is_active: 1,
  gender: GENDER.MALE,
};

function ModalAddAddressBook() {
  const methods = useForm();
  const { openModalAddressBook, refreshTableAddressBook } = useCustomerContext();
  const { id: member_id } = usePageInformation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    methods.reset({ ...INIT_FORM, member_id });
  }, [member_id]);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      await createAddressBook(payload);
      await refreshTableAddressBook();
      showToast.success('Thêm mới thành công');
      openModalAddressBook(false);
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin khách hàng',
      component: FormCustomerAddressBook,
    },
    {
      title: 'Địa chỉ',
      component: AddressSelectAccordion,
    },
  ];

  return (
    <FormProvider {...methods}>
      <ModalPortal
        wrapperId={MODAL.ADD_ADDRESS_BOOK}
        width={800}
        title='Thêm mới địa chỉ'
        onClose={() => openModalAddressBook(false)}
        onConfirm={methods.handleSubmit(onSubmit)}>
        <FormSection loading={loading} detailForm={detailForm} disabled={false} noSideBar={true} />
      </ModalPortal>
    </FormProvider>
  );
}

export default ModalAddAddressBook;
