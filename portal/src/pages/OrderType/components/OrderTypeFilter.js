import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { mapDataOptions4SelectCustom, statusTypesOption } from 'utils/helpers';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

const OrderTypeFilter = ({ onChange }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { businessData = [] } = useSelector((state) => state.global);

  useEffect(() => {
    dispatch(getOptionsGlobal('business'));
  }, []);

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() =>
          onChange({
            search: '',
            is_active: 1,
            created_date_from: null,
            created_date_to: null,
            business_id: null,
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Tên loại đơn hàng' maxLength={250} />,
          },
          {
            title: 'Miền áp dụng',
            component: (
              <FormSelect
                field='business_id'
                list={mapDataOptions4SelectCustom([{ value: 0, label: 'Tất cả' }, ...businessData])}
              />
            ),
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
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default OrderTypeFilter;
