import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { getOptionsGlobal } from 'actions/global';

import { useDispatch, useSelector } from 'react-redux';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4SelectCustom } from 'utils/helpers';

const CustomerFilter = ({ onChange }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { companyData } = useSelector((state) => state.global);

  const onClear = () => {
    methods.reset({
      search: '',
      company_id: null,
    });
    onChange({
      search: '',
      company_id: null,
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
            component: <FormInput field='search' placeholder='Tên hoặc mã ngành hàng' />,
          },
          {
            title: 'Công ty áp dụng',
            component: <FormSelect field='company_id' list={mapDataOptions4SelectCustom(companyData)} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default CustomerFilter;
