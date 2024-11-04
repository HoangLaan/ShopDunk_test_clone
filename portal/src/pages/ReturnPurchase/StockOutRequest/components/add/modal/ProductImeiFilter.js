import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FilterSearchBar from 'components/shared/FilterSearchBar';
import FormInput from 'components/shared/BWFormControl/FormInput';

const ProductImeiFilter = ({ onChange, onClear }) => {
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
        onClear={onClear}
        colSize = {6}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput
                
                field='search'
                placeholder='Nhập tên sản phẩm, mã sản phẩm, SKU'
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                  }
                }}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default ProductImeiFilter;
