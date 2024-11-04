import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';

const DiscountProgramFinnanceCompanyModalFilter = ({ onChange }) => {
  const methods = useForm({
    defaultValues: {},
  });

  const onSubmit = () => {
    const q = {
      keyword: methods.watch('keyword'),
    };
    onChange(q);
  };

  const onClear = () => {
    methods.reset({
      keyword: '',
    });
    onChange({
      keyword: '',
    });
  };

  const handleKeyDownSearch = (event) => {
    if (1 * event.charCode === 13) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput
                onKeyPress={handleKeyDownSearch}
                type='text'
                placeholder='Nhập tên công ty tài chính'
                field='keyword'
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default DiscountProgramFinnanceCompanyModalFilter;
