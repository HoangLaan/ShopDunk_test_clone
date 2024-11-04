import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

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

function StocksTransferTypeFilter({ onChange }) {
  const methods = useForm();

  const onSubmit = () => {
    const q = {
      search: methods.watch('search'),
      from_date: methods.watch('from_date'),
      to_date: methods.watch('to_date'),
      is_active: methods.watch('is_active'),
    };
    onChange(q);
  };

  const onClear = () => {
    methods.reset({
      search: '',
      from_date: null,
      to_date: null,
      is_active: 1,
      error_group_id: null,
    });
    onChange({
      search: '',
      from_date: null,
      to_date: null,
      is_active: 1,
      error_group_id: null,
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
        onSubmit={onChange}
        onClear={onClear}
        colSize={4}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput
                handleKeyDown={handleKeyDownSearch}
                type='text'
                placeholder='Nhập tên hình thức luân chuyển'
                field='search'
              />
            ),
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart='from_date'
                fieldEnd='to_date'
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={STATUS_OPTIONS} defaultValue={1} />,
          },
        ]}
      />
    </FormProvider>
  );
}

export default StocksTransferTypeFilter;
