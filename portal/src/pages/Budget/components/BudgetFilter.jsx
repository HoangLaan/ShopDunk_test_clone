import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DatePicker } from 'antd';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

import { statusTypesOption } from 'utils/helpers';
import { useDispatch } from 'react-redux';

const { RangePicker } = DatePicker;

const ItemFilter = ({ onChange }) => {
  const methods = useForm({ defaultValues: { is_active: 1 } });

  const onClear = () => {
    methods.reset({
      search: '',
      is_active: 2,
      created_date_from: null,
      created_date_to: null,
    });

    onChange({
      search: '',
      is_active: 2,
      created_date_from: null,
      created_date_to: null,
    });
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm ngân sách'
        onSubmit={onChange}
        onClear={() => onClear()}
        colSize={4}
        expanded
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder={'Nhập mã ngân sách, tên ngân sách'} />,
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
            title: 'Kích hoạt',
            component: <FormSelect field='is_active' id='is_active' list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default ItemFilter;
