import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

const CustomerFilter = ({ onChange }) => {
  const methods = useForm();

  const onClear = () => {
    methods.reset({
      search: '',
      created_date_from: null,
      created_date_to: null,
    });
    onChange({
      search: '',
      created_date_from: null,
      created_date_to: null,
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
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập mã đơn mua hàng' />,
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
        ]}
      />
    </FormProvider>
  );
};

export default CustomerFilter;
