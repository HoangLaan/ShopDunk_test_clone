import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { statusTypesOption } from 'utils/helpers';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

const AccountingPeriodFilter = ({ onChange }) => {
  const methods = useForm();

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  const onClear = () => {
    methods.reset({
      search: '',
      is_active: 1,
      created_date_from: null,
      created_date_to: null,
    });
    onChange({
      search: '',
      is_active: 1,
      created_date_from: null,
      created_date_to: null,
    });
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={(v) => {
          methods.setValue('search', v.search?.trim());
          onChange(v);
        }}
        colSize={4}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập tên kỳ kế toán' maxLength={250} />,
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
      />
    </FormProvider>
  );
};

export default AccountingPeriodFilter;
