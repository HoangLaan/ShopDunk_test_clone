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
  payment_type: null,
  search: null,
  is_active: STATUS_TYPES.ACTIVE,
};

const CustomerDepositFilter = ({ onChange, onClearParams }) => {
  const methods = useForm();
  const wflowOptions = useGetOptions(optionType.taskWorkFlow)
  const userOptions = useGetOptions(optionType.user);
  const interestContentOptions = useGetOptions(optionType.interestContent);

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
            component: <FormInput field='search' placeholder='Nhập tên khách hàng đặt cọc' />,
          },
          {
            title: 'Hình thức đặt cọc',
            component: (
              <FormSelect
                field='payment_type'
                list={[
                  { value: null, label: 'Tất cả' },
                  { value: 1, label: 'Đặt cọc online' },
                  { value: 2, label: 'Đặt cọc tại cửa hàng' },
                ]}
              />
            ),
          },
          {
            title: 'Trạng thái đặt cọc',
            component: (
              <FormSelect
                field='payment_status'
                list={[
                  { value: 1, label: 'Đặt cọc thành công' },
                  { value: 2, label: 'Chưa đặt cọc hoặc không đặt cọc' },
                ]}
              />
            ),
          },
          {
            title: 'Ngày đặt cọc',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart='created_date_from'
                fieldEnd='created_date_to'
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD-MM-YYYY HH:mm'}
                showTime
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
          {
            title: 'Nội dung quan tâm',
            component: <FormSelect field='interest_content' list={interestContentOptions} />,
          },
          {
            title: 'Địa điểm nhận hàng',
            component: (
              <FormSelect
                field='is_delivery_type'
                list={[
                  { label: 'Cửa hàng', value: 1 },
                  { label: 'Tại nhà', value: 2 },
                ]}
              />
            ),
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' defaultValue={STATUS_TYPES.ACTIVE} list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default CustomerDepositFilter;
