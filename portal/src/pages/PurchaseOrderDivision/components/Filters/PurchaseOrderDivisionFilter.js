import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

import { STATUS_TYPES } from 'utils/constants';
import { statusReviewOption } from 'utils/helpers';
import { reviewTypeOptions } from 'pages/PurchaseOrderDivision/utils/constants';

const initFilter = {
  search: null,
  is_active: STATUS_TYPES.ACTIVE,
};

const PurchaseOrderDivisionFilter = ({ onChange, onClearParams }) => {
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
            component: <FormInput field='search' placeholder='Nhập tên chia hàng' />,
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
            title: 'Trạng thái duyệt',
            component: <FormSelect field='is_reviewed' defaultValue={statusReviewOption[0].value} list={statusReviewOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default PurchaseOrderDivisionFilter;
