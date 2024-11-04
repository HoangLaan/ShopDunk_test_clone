import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { statusTypesOption } from 'utils/helpers';
import { STATUS_TYPES } from 'utils/constants';

const initFilter = {
  search: null,
  created_date_from: null,
  created_date_to: null,
  is_active: STATUS_TYPES.ACTIVE,
};

const FilterExperience = ({ onChange, onClearParams }) => {
  const methods = useForm();

  const onClear = () => {
    methods.reset(initFilter);
    onClearParams(initFilter);
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        colSize={4}
        onClear={() => onClear({ search: '' })}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Tên số năm kinh nghiệm' />,
          },
          {
            title: 'Kích hoạt',
            component: <FormSelect field='is_active' defaultValue={STATUS_TYPES.ACTIVE} list={statusTypesOption} />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormRangePicker
                style={{ width: '100%' }}
                fieldStart='created_date_from'
                fieldEnd='created_date_to'
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
};

export default FilterExperience;
