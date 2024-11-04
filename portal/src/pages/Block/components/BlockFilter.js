import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { mapDataOptions4Select, statusTypesOption } from 'utils/helpers';
import { getOptionsCompany } from 'services/company.service';

const BlockFilter = ({ onChange }) => {
  const methods = useForm();
  const [companyOptions, setCompanyOptions] = useState([]);

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  const getOptions = useCallback(() => {
    getOptionsCompany().then((res) => {
      setCompanyOptions(mapDataOptions4Select(res));
    });
  }, []);

  useEffect(getOptions, [getOptions]);

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
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder={'Mã khối, tên khối'} field='keyword' />,
          },
          // {
          //   title: 'Ngày tạo',
          //   component: (
          //     <FormDateRange
          //       allowClear={true}
          //       fieldStart={'created_date_from'}
          //       fieldEnd={'created_date_to'}
          //       placeholder={['Từ ngày', 'Đến ngày']}
          //       format={'DD/MM/YYYY'}
          //     />
          //   ),
          // },
          {
            title: 'Trực thuộc công ty',
            isRequired: false,
            component: <FormSelect field='company_id' list={companyOptions} />,
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

export default BlockFilter;
