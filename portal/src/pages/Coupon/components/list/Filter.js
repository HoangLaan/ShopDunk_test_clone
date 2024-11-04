import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { COUPON_TYPES_OPTION } from 'pages/Coupon/utils/constants';


const ListFilter = ({ onChange }) => {
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
      apply_date_from: null,
      apply_date_to: null,
      used_status: null,
    });
    onChange({
      keyword: '',
      is_active: 1,
      apply_date_to: null,
      apply_date_from: null,
      used_status: null,
    });
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        colSize={4}
        onClear={() => onClear()}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder={'Nhập tên khách hàng, số điện thoại, mã giảm giá, mã đơn hàng'}/>,
          },
          {
            title: 'Trạng thái sử dụng',
            component: <FormSelect field='used_status' list={COUPON_TYPES_OPTION} />,
          },
          {
            title: 'Thời gian áp dụng',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'apply_date_from'}
                fieldEnd={'apply_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default ListFilter;
