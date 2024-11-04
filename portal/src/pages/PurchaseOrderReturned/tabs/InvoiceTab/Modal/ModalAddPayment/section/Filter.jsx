import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';

import FormSelect from 'components/shared/BWFormControl/FormSelect';

const CustomerFilter = ({ onChange, purchaseInvoiceOptions = [] }) => {
  const methods = useForm();

  const onClear = () => {
    methods.reset({
      purchase_order_code: null,
    });
    onChange({
      purchase_order_code: null,
    });
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear()}
        colSize={4}
        expanded
        actions={[
          {
            title: 'Đơn mua hàng',
            component: <FormSelect field='purchase_order_code' list={purchaseInvoiceOptions} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default CustomerFilter;
