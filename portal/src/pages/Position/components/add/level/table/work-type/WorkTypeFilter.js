import React, { useEffect } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar';
import { FormProvider, useForm } from 'react-hook-form';
import { statusTypesOption } from 'utils/helpers';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

const WorkTypeFilter = ({ onChange }) => {
  const methods = useForm();

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, []);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title={'Tìm kiếm'}
        onSubmit={onChange}
        onClear={() =>
          onChange({
            keyword: '',
            create_date_from: undefined,
            create_date_to: undefined,
            is_active: 1,
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput
                field='keyword'
                placeholder={'Tên kỹ năng'}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    document.getElementById('fitler_search_bar').click();
                    event.preventDefault();
                  }
                }}
              />
            ),
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormDateRange
                fieldStart={'create_date_from'}
                fieldEnd={'create_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
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

export default WorkTypeFilter;
