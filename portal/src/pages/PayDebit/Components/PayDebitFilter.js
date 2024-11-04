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

const DEBIT_STATUS = {
  NONE: 0,
  DONE: 1,
  NOT_EXPIRED: 2,
  EXPIRED: 3,
  DONE_BUT_EXPIRED: 4,
};

const overDueOptions = [
  { label: 'Tất cả', value: null },
  { label: 'Đã quá hạn', value: DEBIT_STATUS.EXPIRED },
  { label: 'Chưa quá hạn', value: DEBIT_STATUS.NOT_EXPIRED },
  { label: 'Hoàn thành', value: DEBIT_STATUS.DONE },
  { label: 'Hoàn thành trễ hạn', value: DEBIT_STATUS.DONE_BUT_EXPIRED },
];

const paymentStatusOptions = [
  { label: 'Tất cả', value: 0 },
  { label: 'Đã thanh toán', value: 1 },
  { label: 'Chưa thanh toán', value: 2 },
  { label: 'Thanh toán một phần', value: 3 },
];

const PayDebitFilter = ({ onChange }) => {
  const methods = useForm();
  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, []);
  const onClear = () => {
    methods.reset({
      search: '',
      is_active: 1,
      from_date: null,
      to_date: null,
      debt_type: null,
      is_overdue: null,
      payment_status: null,
    });
    onChange({
      search: '',
      is_active: 1,
      to_date: null,
      from_date: null,
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
            component: <FormInput placeholder={'Nhập tên đối tượng, số phiếu, số hóa đơn'} field='search' />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'from_date'}
                fieldEnd={'to_date'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          {
            title: 'Trạng thái thanh toán',
            component: <FormSelect field='payment_status' list={paymentStatusOptions} />,
          },
          // {
          //   title: 'Loại công nợ',
          //   component: <FormSelect field='debt_type' list={debtTypeOptions} />,
          // },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_overdue' list={overDueOptions} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default PayDebitFilter;
