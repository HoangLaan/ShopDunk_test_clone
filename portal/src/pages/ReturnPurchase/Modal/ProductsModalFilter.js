import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FilterSearchBar from 'components/shared/FilterSearchBar';

const defaultValues = {
  keyword: '',
  created_date_from: null,
  created_date_to: null,
};
export default function ProductsModalFilter({ onChange, onReset }) {
  const methods = useForm({ defaultValues });
  const { watch, reset, getValues } = methods;

  const onClear = () => {
    reset(defaultValues);
    onReset(defaultValues);
  };
  const handleKeyDownSearch = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      onChange(getValues());
    }
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        colSize={3}
        onSubmit={(value) => onChange({ ...value, page: 1 })}
        onClear={onClear}
        actions={[
          // {
          //   title: 'Đối tượng',
          //   component: <FormSelect field='object_type' list={ProductsModalOptions} />,
          // },
          {
            title: 'Từ khóa',
            component: (
              <FormInput
                onKeyDown={handleKeyDownSearch}
                type='text'
                placeholder='Nhập Imei, số hóa đơn, mã hàng'
                field='keyword'
              />
            ),
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormRangePicker
                fieldStart={'created_date_from'}
                fieldEnd={'created_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
}
