import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { statusTypesOption } from 'utils/helpers';

const AnnounceTypeFilter = ({ onChange }) => {
  const methods = useForm();

  useEffect(() => {
    methods.reset({
      is_active: 1,
      is_company: 2,
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
            created_date_from: undefined,
            created_date_to: undefined,
            is_company: undefined,
            is_active: 1,
          })
        }
        actions={[
          {
            title: 'Từ khoá',
            component: <FormInput field='search' placeholder='Tên loại thông báo' />,
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
            title: 'Thể loại',
            component: (
              <FormSelect
                field='is_company'
                list={[
                  {
                    label: 'Tất cả',
                    value: 2,
                  },
                  {
                    label: 'Thông báo nội bộ',
                    value: 1,
                  },
                  {
                    label: 'Thông báo khách hàng',
                    value: 0,
                  },
                ]}
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

export default AnnounceTypeFilter;
