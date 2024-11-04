import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

const debtTypeOptions = [
  { label: 'Tất cả', value: 3 },
  { label: 'Công nợ phải thu', value: 1 },
  { label: 'Công nợ phải trả', value: 2 },
];

const overDueOptions = [
  { label: 'Tất cả', value: 2 },
  { label: 'Đã quá hạn', value: 1 },
  { label: 'Chưa quá hạn', value: 0 },
];

const paymentStatusOptions = [
  { label: 'Tất cả', value: 0 },
  { label: 'Đã thanh toán', value: 1 },
  { label: 'Chưa thanh toán', value: 2 },
  { label: 'Thanh toán một phần', value: 3 },
];

const DebitFilter = ({ onChange }) => {
  const methods = useForm();
  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, []);
  const onClear = () => {
    methods.reset({
      keyword: '',
      is_active: 1,
      created_date_from: null,
      created_date_to: null,
      debt_type: null,
      is_overdue: null,
      payment_status: null,
    });
    onChange({
      keyword: '',
      is_active: 1,
      created_date_to: null,
      created_date_from: null,
      debt_type: null,
      is_overdue: null,
      payment_status: null,
    });
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear()}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'created_date_from'}
                fieldEnd={'created_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          {
            title: 'Loại công nợ',
            component: <FormSelect field='debt_type' list={debtTypeOptions} />,
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_overdue' list={overDueOptions} />,
          },
          {
            title: 'Thanh toán',
            component: <FormSelect field='payment_status' list={paymentStatusOptions} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default DebitFilter;
