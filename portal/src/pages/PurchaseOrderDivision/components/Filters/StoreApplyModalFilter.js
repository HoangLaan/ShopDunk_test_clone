import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { STATUS_TYPES } from 'utils/constants';

const initFilter = {
  search: null,
  is_active: STATUS_TYPES.ACTIVE,
};

const StoreApplyModalFilter = ({ onChange, onClearParams }) => {
  const methods = useForm();

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
        colSize={12}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập tên cửa hàng' />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default StoreApplyModalFilter;
