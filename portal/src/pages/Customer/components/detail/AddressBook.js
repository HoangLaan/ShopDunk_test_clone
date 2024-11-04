import FormSection from 'components/shared/FormSection/index';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import TableAddressBook from '../tables/TableAddressBook';
import usePageInformation from 'hooks/usePageInformation';
import { showToast } from 'utils/helpers';
import { updateCustomerAddressBookList } from 'services/customer.service';
import { validateAddressBook } from 'pages/Customer/utils/formRules';

function AddressBook() {
  const methods = useForm();
  const [loading, setLoading] = useState(false);
  const { disabled, id: member_id } = usePageInformation();

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      if (!validateAddressBook(payload.address_book_list)) {
        return showToast.error('Vui lòng chọn địa chỉ mặc định');
      }
      await updateCustomerAddressBookList(member_id, payload);
      showToast.success();
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Địa chỉ khách hàng',
      id: 'customer_address_book',
      component: TableAddressBook,
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection noSideBar={true} onSubmit={onSubmit} loading={loading} detailForm={detailForm} disabled={disabled} />
    </FormProvider>
  );
}

export default AddressBook;
