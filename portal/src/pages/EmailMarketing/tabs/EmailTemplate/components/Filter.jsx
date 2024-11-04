import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const CustomerListFilter = ({ onChange }) => {
  const methods = useForm();

  useEffect(() => {
    methods.reset({});
  }, [methods]);

  const onClear = () => {
    methods.reset({
      mail_supplier: 1,
    });
    onChange({
      search: '',
      created_date_from: null,
      created_date_to: null,
      mail_supplier: 1,
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
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập tên mẫu email' maxLength={250} />,
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
            title: 'Nhà cung cấp',
            component: <FormSelect defaultValue={1} field='mail_supplier' list={[{ label: 'Mailchimp', value: 1 }]} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default CustomerListFilter;
