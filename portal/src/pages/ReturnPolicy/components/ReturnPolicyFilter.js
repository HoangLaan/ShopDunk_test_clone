import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { mapDataOptions4Select, mapDataOptions4SelectCustom, statusTypesOption } from 'utils/helpers';
import { getProductOptions, getCategoryOptions } from 'services/return-policy.service';

const ReturnPolicyFilter = ({ onChange }) => {
  const methods = useForm();
  const { watch, setValue } = methods;
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  const isDisabledProduct = watch('category_id_search') ? false : true;

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  const handleSelectCategory = useCallback((category_id) => {
    getProductOptions({ category_id: category_id === -1 ? null : category_id }).then((res) => {
      setProductOptions(mapDataOptions4Select(res, 'product_id', 'product_name'));
    });
  }, []);

  useEffect(() => {
    getCategoryOptions().then((res) => {
      setCategoryOptions([{ value: -1, label: 'Tất cả' }, ...mapDataOptions4SelectCustom(res)]);
    });
  }, []);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() =>
          onChange({
            keyword: undefined,
            category_id_search: undefined,
            product_id_search: undefined,
            is_active: 1,
            start_date: undefined,
            end_date: undefined,
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput placeholder={'Nhập tên chính sách, mã chính sách, người tạo, tỷ lệ thu phí'} field='keyword' />
            ),
          },
          {
            title: 'Ngành hàng',
            component: (
              <FormSelect
                allowClear
                field='category_id_search'
                list={categoryOptions}
                onChange={(value) => {
                  handleSelectCategory(value);
                  setValue('category_id_search', value);
                }}
              />
            ),
          },
          {
            title: 'Sản phẩm',
            component: (
              <FormSelect
                allowClear={true}
                disabled={isDisabledProduct}
                field='product_id_search'
                list={productOptions}
              />
            ),
          },
          {
            title: 'Thời gian áp dụng',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'start_date'}
                fieldEnd={'end_date'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          },
        ]}
        colSize={6}
      />
    </FormProvider>
  );
};

export default ReturnPolicyFilter;
