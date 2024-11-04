import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { statusTypesOption } from 'utils/helpers';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { DefaultFilter } from '../utils/constant';

const InstallmentFilter = ({ onChange }) => {
  const methods = useForm();
  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  const onClear = () => {
    methods.reset(DefaultFilter);
    onChange(DefaultFilter);
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        colSize={6}
        onSubmit={(v) => {
          methods.setValue('search', v.search?.trim());
          onChange(v);
        }}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Tên mã đối tác, tên đối tác' maxLength={250} />,
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

export default InstallmentFilter;
