import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { getOptionsGlobal } from 'actions/global';

import { useDispatch } from 'react-redux';
import FormInput from 'components/shared/BWFormControl/FormInput';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const CustomerFilter = ({ onChange }) => {
  const methods = useForm();
  const dispatch = useDispatch();

  const customerTypeOptions = useGetOptions(optionType.customerType)

  const onClear = () => {
    methods.reset({
      search: '',
    });
    onChange({
      search: '',
    });
  };

  useEffect(() => {
    dispatch(getOptionsGlobal('company'));
  }, []);

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
            component: <FormInput field='search' placeholder='Nhập email, số điện thoại' />,
          },
          {
            title: 'Hạng khách hàng',
            component: <FormSelect field='customer_type_id' list={customerTypeOptions} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default CustomerFilter;
