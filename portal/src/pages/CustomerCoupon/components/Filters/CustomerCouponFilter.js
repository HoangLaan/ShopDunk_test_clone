import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

import { STATUS_TYPES } from 'utils/constants';
import { statusTypesOption } from 'utils/helpers';
import useGetOptions, { optionType } from 'hooks/useGetOptions';

const initFilter = {
  search: null,
  is_active: STATUS_TYPES.ACTIVE,
};

const CustomerCouponFilter = ({ onChange, onClearParams }) => {
  const methods = useForm();
  const wflowOptions = useGetOptions(optionType.taskWorkFlow)
  const userOptions = useGetOptions(optionType.user);
  useEffect(() => {
    methods.reset(initFilter);
  }, [methods]);

  const onClear = () => {
    methods.reset(initFilter);
    onClearParams();
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập mã giảm giá, mã khách hàng, tên khách hàng' />,
          },
          {
            title: 'Ngày sử dụng',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart='used_date_from'
                fieldEnd='used_date_to'
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          {
            title: 'Trạng thái sử dụng',
            component: (
              <FormSelect
                field='is_used'
                list={[
                  { value: null, label: 'Tất cả' },
                  { value: 1, label: 'Đã sử dụng' },
                  { value: 0, label: 'Chưa sử dụng' },
                ]}
              />
            ),
          },
          {
            title: 'Trạng thái',
            component: (
              <FormSelect
                field='is_member'
                list={[
                  { value: null, label: 'Tất cả' },
                  { value: 1, label: 'Khách hàng cũ' },
                  { value: 0, label: 'Khách hàng mới' },
                ]}
              />
            ),
          },
          {
            title: 'Trạng thái CSKH',
            component: <FormSelect field='wflow_id'list={wflowOptions} allowClear />,
          },
          {
            title: 'Người xử lý',
            component: <FormSelect field='staff_user' list={userOptions} />,
          },
          {
            title: 'Người giám sát',
            component: <FormSelect field='supervisor_user' list={userOptions} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default CustomerCouponFilter;
