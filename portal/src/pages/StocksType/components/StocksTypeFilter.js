import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { statusTypesOption } from 'utils/helpers';
import { STATUS_TYPES } from 'utils/constants';

const StocksTypeFilter = ({ handleSubmitFilter }) => {
  const methods = useForm();

  const onClear = () => {
    const initFilter = {
      keyword: null,
      start_date: null,
      end_date: null,
      is_active: STATUS_TYPES.ACTIVE,
    };
    methods.reset(initFilter);
    handleSubmitFilter(initFilter);
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={handleSubmitFilter}
        onClear={() => onClear({ search: '' })}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='keyword' placeholder='Mã loại kho, tên loại kho' />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormRangePicker
                style={{ width: '100%' }}
                fieldStart='start_date'
                fieldEnd='end_date'
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
          {
            title: 'Kích hoạt',
            component: <FormSelect field='is_active' defaultValue={STATUS_TYPES.ACTIVE} list={statusTypesOption} />,
          },
        ]}
        colSize={4}
      />
    </FormProvider>
  );
};

export default StocksTypeFilter;
