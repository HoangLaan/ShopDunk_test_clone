import React, { useEffect, useState } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { mapDataOptions4Select, statusTypesOption } from 'utils/helpers';
import { getDocumentOptions } from 'services/default-account.service';
import FormItem from 'components/shared/BWFormControl/FormItem';

const DefaultAccountFilter = ({ onChange }) => {
  const methods = useForm();

  const [documentOptions, setDocumentOptions] = useState([]);
  useEffect(() => {
    getDocumentOptions().then(({ items: data }) => {
      setDocumentOptions(mapDataOptions4Select(data));
    });
  }, []);

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
            keyword: undefined,
            is_active: 1,
            created_date_from: undefined,
            created_date_to: undefined,
            document_id: undefined,
            page: 1
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder={'Nhập tên định khoản'} field='keyword' />,
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
          {
            title: 'Loại chứng từ',
            component: <FormSelect field={'document_id'} list={documentOptions} />,
          },
        ]}
        colSize={3}
      />
    </FormProvider>
  );
};

export default DefaultAccountFilter;
