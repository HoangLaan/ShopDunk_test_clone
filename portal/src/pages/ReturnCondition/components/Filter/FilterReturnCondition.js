import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { budgetCreationOption, returnConditionnOption, statusTypesOption } from 'utils/helpers';
import { RETURN_CONDITION, STATUS_TYPES } from 'utils/constants';

const FilterReturnCondition = ({ onChange }) => {
  const methods = useForm();

  const onClear = () => {
    const initFilter = {
      search: null,
      created_date_from: null,
      created_date_to: null,
      is_option: RETURN_CONDITION.ALL,
    };
    methods.reset(initFilter);
    onChange(initFilter);
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear({ search: '' })}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập điều kiện đổi trả' />,
          },
          {
            title: 'Áp dụng cho chính sách',
            component: (
              <FormSelect field='is_option' defaultValue={RETURN_CONDITION.ALL} list={returnConditionnOption} />
            ),
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
          {
            title: 'Kích hoạt',
            component: <FormSelect field='is_active' defaultValue={STATUS_TYPES.ACTIVE} list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default FilterReturnCondition;
