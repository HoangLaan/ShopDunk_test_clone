import React, { useEffect, useState, useCallback } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { statusTypesOption } from 'utils/helpers';
import { getListFunctionGroup } from 'services/function.service';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';

const FunctionsFilter = ({ onChange }) => {
  const methods = useForm();
  const [dataListFunctionGroup, setDataListFunctionGroup] = useState();

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, []);

  const loadFunctionGroup = useCallback(() => {
    getListFunctionGroup().then(setDataListFunctionGroup);
  }, []);
  useEffect(loadFunctionGroup, [loadFunctionGroup]);

  const onClear = () => {
    methods.reset({
      search: '',
      create_date_from: null,
      create_date_to: null,
      is_active: 1,
      function_group_id: null
    });
    onChange({
      search: '',
      create_date_from: null,
      create_date_to: null,
      is_active: 1,
      function_group_id: ''
    });
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear()}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder={'Nhập tên quyền, mã hiệu quyền'} />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormRangePicker
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
          {
            title: 'Nhóm quyền',
            component: (
              <FormSelect
                field='function_group_id'
                id='bw_company'
                list={(dataListFunctionGroup ?? []).map((_) => {
                  return {
                    label: _.name,
                    value: _.id,
                  };
                })}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default FunctionsFilter;
