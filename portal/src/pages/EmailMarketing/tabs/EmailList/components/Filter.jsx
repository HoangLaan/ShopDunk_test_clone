import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { statusTypesOption } from 'utils/helpers';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { LIST_TYPE } from 'pages/EmailMarketing/utils/constants';

const CustomerListFilter = ({ onChange }) => {
  const methods = useForm();

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  const onClear = () => {
    methods.reset({
      search: '',
      email_list_type: null,
      created_date_from: null,
      created_date_to: null,
    });
    onChange({
      search: '',
      email_list_type: null,
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
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập tên danh sách' maxLength={250} />,
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
            title: 'Loại danh sách',
            component: <FormSelect field='email_list_type' list={LIST_TYPE} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default CustomerListFilter;
