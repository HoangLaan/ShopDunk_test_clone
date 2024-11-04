import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';

const INIT_FORM = {
  search: null,
};

const FilterSelectCondition = ({ onChange }) => {
  const methods = useForm();

  const onClear = () => {
    methods.reset(INIT_FORM);
    onChange(INIT_FORM);
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear({ search: '' })}
        colSize={12}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Tên loại công việc' />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default FilterSelectCondition;