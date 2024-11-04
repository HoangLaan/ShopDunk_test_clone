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

const CustomerSubscriberReportFilter = ({ onChange, onClearParams }) => {
  const methods = useForm();
  const wflowOptions = useGetOptions(optionType.taskWorkFlow);
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
            component: <FormInput field='search' placeholder='Nhập email, tên khách hàng nhận tin' />,
          },
          {
            title: 'Đối tượng',
            component: (
              <FormSelect
                field='type_search'
                list={[
                  { value: null, label: 'Tất cả' },
                  { value: 1, label: 'Khách hàng nhận tin' },
                  { value: 2, label: 'Khách hàng có mã giảm giá' },
                ]}
              />
            ),
          },
          {
            title: 'Trạng thái mua hàng',
            component: (
              <FormSelect
                field='is_ordered'
                list={[
                  { value: null, label: 'Tất cả' },
                  { value: 1, label: 'Đã mua hàng' },
                  { value: 0, label: 'Chưa mua hàng' },
                ]}
              />
            ),
          },
          {
            title: 'Trạng thái sử dụng',
            component: (
              <FormSelect
                field='is_use_voucher'
                list={[
                  { value: null, label: 'Tất cả' },
                  { value: 1, label: 'Đã sử dụng' },
                  { value: 0, label: 'Chưa sử dụng' },
                ]}
              />
            ),
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart='created_date_from'
                fieldEnd='created_date_to'
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          {
            title: 'Trạng thái CSKH',
            component: <FormSelect field='wflow_id' id='bw_company' list={wflowOptions} allowClear />,
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
            title: 'Trạng thái',
            component: <FormSelect field='is_active' defaultValue={STATUS_TYPES.ACTIVE} list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default CustomerSubscriberReportFilter;
