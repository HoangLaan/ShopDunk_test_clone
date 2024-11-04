import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';

function ReportHisBuyIPFilter({ onChange }) {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() =>
          onChange({
            search: '',
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Tên khách hàng, số điện thoại' maxLength={250} />
          },
        ]}
      />
    </FormProvider>
  );
}

export default ReportHisBuyIPFilter;
