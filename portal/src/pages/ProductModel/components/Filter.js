import React, { useState, useEffect } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';
import { getOptionsTreeview } from 'services/product-category.service';

const STATUS_OPTIONS = [
  {
    value: 2,
    label: 'Tất cả',
  },
  {
    value: 1,
    label: 'Kích hoạt',
  },
  {
    value: 0,
    label: 'Ẩn',
  },
];

const SHOW_WEB_OPTIONS = [
  {
    value: 2,
    label: 'Tất cả',
  },
  {
    value: 1,
    label: 'Hiện',
  },
  {
    value: 0,
    label: 'Ẩn',
  },
];

const Filter = ({ onChange }) => {
  const methods = useForm();

  useEffect(() => {
    methods.register('company_id');
    methods.register('is_active');
  }, [methods.register]);

  const onSubmit = () => {
    const q = {
      search: methods.watch('search'),
      is_active: methods.watch('is_active') ?? 1,
      is_show_web: methods.watch('is_show_web') ?? 1,
      company_id: methods.watch('company_id'),
      from_date: methods.watch('from_date'),
      to_date: methods.watch('to_date'),
      product_category_id: methods.watch('product_category_id'),
    };
    onChange(q);
  };

  const onClear = () => {
    methods.reset({
      search: '',
      is_active: 1,
      is_show_web: 1,
      company_id: null,
      from_date: null,
      to_date: null,
      product_category_id: null,
    });
    onChange({
      search: '',
      is_active: 1,
      is_show_web: 1,
      company_id: null,
      from_date: null,
      to_date: null,
      product_category_id: null,
    });
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
        colSize={4}
        onSubmit={onChange}
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput
                onKeyDown={handleKeyDownSearch}
                type='text'
                placeholder='Nhập tên model, mã model'
                field='search'
              />
            ),
          },
          {
            title: 'Ngành hàng',
            component: (
              <FormTreeSelect
                field='product_category_id'
                treeDataSimpleMode
                fetchOptions={getOptionsTreeview}
                placeholder='Tất cả'
              />
            ),
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormRangePicker
                fieldStart={'from_date'}
                fieldEnd={'to_date'}
                format={['DD/MM/YYYY', 'DD/MM/YYYY']}
                allowClear
                placeholder={['dd/mm/yyyy', 'dd/mm/yyyy']}
              />
            ),
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' defaultValue={1} list={STATUS_OPTIONS} />,
          },
          {
            title: 'Hiển thị web',
            component: <FormSelect field='is_show_web' defaultValue={1} list={SHOW_WEB_OPTIONS} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default Filter;
