import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';
import FilterSearchBar from 'components/shared/FilterSearchBar';
import React from 'react'
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { getOptionsTreeview } from 'services/product-category.service';

function Filter({ onChange }) {
    const methods = useForm();

    useEffect(() => {
        methods.reset({
          is_active: 1,
        });
      }, [methods]);

      const onSubmit = () => {
        const q = {
          search: methods.watch('search'),
          product_category_id: methods.watch('product_category_id'),
        };
        onChange(q);
      };

      const handleKeyDownSearch = (event) => {
        if (1 * event.keyCode === 13) {
          event.preventDefault();
          onSubmit();
        }
      };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() =>
          onChange({
            search: undefined,
            product_category_id: undefined,
          })
        }
        actions={[
            {
                title: 'Từ khóa',
                component: (
                  <FormInput
                    onKeyDown={handleKeyDownSearch}
                    type='text'
                    placeholder='Tìm kiếm theo mã sản phẩm, tên sản phẩm'
                    field='search'
                  />
                ),
              },
                {
                title: 'Ngành hàng',
                component: (
                  <FormTreeSelect field='product_category_id' treeDataSimpleMode fetchOptions={getOptionsTreeview} />
                ),
              },
            ]}
            colSize={4}
            />
    </FormProvider>
  )
}

export default Filter