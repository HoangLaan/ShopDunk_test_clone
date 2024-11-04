import React from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { statusTypesOption } from 'utils/helpers';
import { FormProvider, useForm } from 'react-hook-form';

const AreaFilter = ({ onChange, onClear }) => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() =>
          onClear({
            is_active: 1,
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder='Nhập tên khu vực' field='search' />,
          },
          {
            title: 'Thời gian tạo',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'create_date_from'}
                fieldEnd={'create_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' id='bw_company' list={statusTypesOption} />,
          },
        ]}
        colSize={4}
      />
    </FormProvider>
  );
};

export default AreaFilter;
