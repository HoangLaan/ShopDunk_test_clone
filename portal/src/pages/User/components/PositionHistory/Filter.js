import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

const Filter = ({ onChange }) => {
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
            search: undefined,
            effective_date_from: undefined,
            effective_date_to: undefined,
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='keyword' />,
          },
          {
            title: 'Ngày hiệu lực',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'effective_date_from'}
                fieldEnd={'effective_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default Filter;
