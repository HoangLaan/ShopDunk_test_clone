import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';
import { getOptionsModel, getOptionsTreeview } from 'services/product-category.service';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { mapDataOptions4Select } from 'utils/helpers';
import { notification } from 'antd';
import { useCallback } from 'react';

const SelectProductModalFilter = ({ onChange }) => {
  const methods = useForm();
  const [productModelOptions, setProductModelOptions] = useState([]);

  const productCategoryId = methods.watch('product_category_id');

  const getProductModelOptions = useCallback(
    async (search = '') => {
      try {
        let models = [];
        if (productCategoryId) {
          const res = await getOptionsModel({ search, limit: 100, productCategoryId });
          models = mapDataOptions4Select(res);
        }
        return models;
      } catch (error) {
        notification.error({ message: error.message || 'Lỗi lấy model sản phẩm.' });
      }
    },
    [productCategoryId],
  );

  useEffect(() => {
    getProductModelOptions().then((res) => setProductModelOptions(res));
    methods.setValue('model_id', null);
  }, [productCategoryId, methods, getProductModelOptions]);

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);
  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() =>
          onChange({
            search: undefined,
            product_category_id: undefined,
            model_id: undefined,
            page: 1,
          })
        }
        actions={[
          {
            title: 'Từ khoá',
            component: (
              <FormInput
                field='search'
                placeholder='Nhập mã sản phẩm, tên sản phẩm'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    methods.handleSubmit(onChange)();
                  }
                }}
              />
            ),
          },
          {
            title: 'Ngành hàng',
            component: (
              <FormTreeSelect field='product_category_id' treeDataSimpleMode fetchOptions={getOptionsTreeview} />
            ),
          },
          {
            title: 'Model',
            component: (
              <FormDebouneSelect
                disabled={!productCategoryId}
                field='model_id'
                fetchOptions={getProductModelOptions}
                allowClear={true}
                placeholder='Tất cả'
                options={productModelOptions}
              />
            ),
          },
        ]}
        colSize={4}
      />
    </FormProvider>
  );
};

export default SelectProductModalFilter;
