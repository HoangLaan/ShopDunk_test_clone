import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { statusTypesOption } from 'utils/helpers';
import { elementTypeOptions, propertiesOptions } from 'pages/PayrollTemplate/helper/const';

const SalaryElementFilter = ({ onChange, companyOptions }) => {
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
          onChange({
            keyword: undefined,
            is_active: 1,
            created_date_from: undefined,
            created_date_to: undefined,
            company_id: undefined,
            element_type: undefined,
            property: undefined,
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder={'Nhập tên thành phần lương'} field='keyword' />,
          },
          {
            title: 'Công ty áp dụng',
            component: <FormSelect field='company_id' list={companyOptions} />,
          },
          {
            title: 'Loại thành phần',
            component: <FormSelect field='element_type' list={elementTypeOptions} />,
          },
          {
            title: 'Tính chất',
            component: <FormSelect field='property' list={propertiesOptions} />,
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

export default SalaryElementFilter;
