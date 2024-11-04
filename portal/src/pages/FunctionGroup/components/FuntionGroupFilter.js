import React, { useEffect, useState, useCallback } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { statusTypesOption } from 'utils/helpers';

const FuntionGroupFilter = ({ onChange, onClearParams }) => {
  const methods = useForm();

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  const initFilter = {
    search: '',
    create_date_from: null,
    create_date_to: null,
    is_active: 1,
  };

  const onClear = () => {
    methods.reset(initFilter);
    onClearParams();
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
            component: <FormInput field='keyword' placeholder={'Nhập nhóm quyền'} />,
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

export default FuntionGroupFilter;
