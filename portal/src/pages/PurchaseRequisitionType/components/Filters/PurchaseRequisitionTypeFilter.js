import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

import { STATUS_TYPES } from 'utils/constants';
import { statusTypesOption } from 'utils/helpers';

const initFilter = {
  search: null,
  is_active: STATUS_TYPES.ACTIVE,
};

const PurchaseRequisitionTypeFilter = ({ onChange, onClearParams }) => {
  const methods = useForm();

  useEffect(() => {
    methods.reset(initFilter);
  }, [methods]);

  const onClear = () => {
    methods.reset(initFilter);
    onClearParams();
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập tên loại yêu cầu mua hàng' />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart='created_date_from'
                fieldEnd='created_date_to'
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' defaultValue={STATUS_TYPES.ACTIVE} list={statusTypesOption} />,
          },
        ]}
        colSize={4}
      />
    </FormProvider>
  );
};

export default PurchaseRequisitionTypeFilter;
