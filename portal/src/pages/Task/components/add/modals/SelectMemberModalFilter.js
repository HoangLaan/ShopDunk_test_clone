import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { statusTypesOption, genderTypesOptions } from 'utils/helpers';
import { CRM_STATE } from 'pages/Task/utils/const';

const SelectMemberModalFilter = ({ onChange, customerType }) => {
  const methods = useForm();

  useEffect(() => {
    methods.reset({
      gender: 2,
      crm_state: 1,
      is_active: 1,
      customer_type: customerType,
    });
  }, [methods, customerType]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => {
          methods.reset({
            gender: 2,
            crm_state: 1,
            is_active: 1,
            created_date_from: undefined,
            created_date_to: undefined,
            customer_type: customerType,
            page: 1,
          });

          onChange({
            search: undefined,
            gender: 2,
            state: 1,
            is_active: 1,
            created_date_from: undefined,
            created_date_to: undefined,
            customer_type: customerType,
            page: 1,
          });
        }}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput field='keyword' placeholder='Nhập mã khách hàng, tên khách hàng, số điện thoại, email' />
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
            title: 'Trạng thái chăm sóc',
            component: <FormSelect field='crm_state' list={CRM_STATE} />,
          },
          {
            title: 'Giới tính',
            component: <FormSelect field='gender' list={genderTypesOptions} />,
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

export default SelectMemberModalFilter;
