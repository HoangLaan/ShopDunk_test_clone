import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { statusTypesOption } from 'utils/helpers';

const PayrollTemplateFilter = ({ onChange }) => {
  const methods = useForm();
  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() =>
          onChange({
            keyword: undefined,
            is_active: 1,
            created_date_from: undefined,
            created_date_to: undefined,
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder={'Nhập tên mẫu bảng lương'} field='keyword' />,
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

export default PayrollTemplateFilter;
