import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { statusTypesOption } from 'utils/helpers';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

const SupplierFilter = ({ onChange, onClearParams }) => {
  const methods = useForm();

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, []);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => {
          onChange({ search: '', is_active: 1 });
          onClearParams()
        }}
        colSize={6}
        actions={[
          {
            title: 'Từ khoá',
            component: <FormInput field='search' placeholder='Nhập mã nhà cung cấp, tên nhà cung cấp, tên thay thế, người đại diện, địa chỉ' />,
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

export default SupplierFilter;
