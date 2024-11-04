import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { statusTypesOption } from 'utils/helpers';

const DocumentTypeFilter = ({ onChange }) => {
  const methods = useForm();

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, []);

  const onClear = () => {
    methods.reset({
      search: '',
      is_active: 1,
      created_date_from: '',
      created_date_to: '',
      page: 1,

    });
    onChange({
      search: '',
      is_active: 1,
      created_date_from: '',
      created_date_to: '',
      page: 1,
    });
  };

  const onSubmit = () => {
    const q = {
      search: methods.watch('search'),
      is_active: methods.watch('is_active') ?? 1,
      created_date_from: methods.watch('created_date_from'),
      created_date_to: methods.watch('created_date_to'),
    };
    onChange(q);
  };

  const handleKeyDownSearch = (event) => {
    if (1 * event.charCode === 13) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' onKeyPress={handleKeyDownSearch} placeholder='Nhập tên loại hồ sơ' />,
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

export default DocumentTypeFilter;
