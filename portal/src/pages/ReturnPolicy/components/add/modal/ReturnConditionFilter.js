import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { statusTypesOption } from 'utils/helpers';

const ReturnConditionFilter = ({ onChange, policyTypeList, defaultPolicy }) => {
  const [typePolicyCurrent, setTypePolicyCurrent] = useState(defaultPolicy);
  const methods = useForm({
    defaultValues: {
      type_policy: typePolicyCurrent,
    },
  });

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => {
          methods.setValue('type_policy', typePolicyCurrent);
          onChange({
            keyword: undefined,
            is_active: 1,
            created_date_from: undefined,
            created_date_to: undefined,
            type_policy: typePolicyCurrent,
          });
        }}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder={'Nhập điều kiện đổi trả'} field='keyword' />,
          },
          {
            title: 'Áp dụng cho chính sách',
            component: (
              <FormSelect
                defaultValue={typePolicyCurrent}
                field='type_policy'
                list={policyTypeList}
                onChange={(e) => {
                  setTypePolicyCurrent(e);
                  methods.setValue('type_policy', e);
                }}
              />
            ),
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'created_date_from'}
                fieldEnd={'created_date_to'}
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
        colSize={4}
      />
    </FormProvider>
  );
};

export default ReturnConditionFilter;
