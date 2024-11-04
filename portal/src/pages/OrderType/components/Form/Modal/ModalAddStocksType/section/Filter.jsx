import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';

const CustomerFilter = ({ onChange }) => {
  const methods = useForm();

  const onClear = () => {
    methods.reset({
      keyword: '',
    });
    onChange({
      keyword: '',
    });
  };

  const handleKeyDownSearch = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      methods.handleSubmit(onChange)(event);
    }
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
            component: <FormInput onKeyDown={handleKeyDownSearch} field='keyword' placeholder='Mã loại kho hoặc tên loại kho' />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default CustomerFilter;
