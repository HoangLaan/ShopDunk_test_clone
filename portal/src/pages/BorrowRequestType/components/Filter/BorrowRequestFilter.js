import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { statusTypesOption } from 'utils/helpers';
import { STATUS_TYPES } from 'utils/constants';
import {listTypeBorrow} from "../../utils/utils";

const FilterBudgetType = ({ onChange }) => {
  const methods = useForm();

  const onClear = () => {
    const initFilter = {
      search: null,
      created_date_from: null,
      borrow_type_code:null,
      created_date_to: null,
      is_active: STATUS_TYPES.ACTIVE,
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
            component: (
              <FormInput field='search' placeholder='Tên loại ngân sách' />
            ),
          },
          {
            title: 'Loại hình thức mượn hàng',
            component: (
              <FormSelect allowClear={true} field='borrow_type_code' list={listTypeBorrow} />
            ),
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

export default FilterBudgetType;
