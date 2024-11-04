import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { mapDataOptions4Select, statusTypesOption } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';

const RegimeTypeFilter = ({ onChange, onClear }) => {
  const dispatch = useDispatch();
  const methods = useForm();

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
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khoá',
            component: <FormInput field='search' placeholder='Tên loại chế độ' />,
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
            title: 'Loại chế độ',
            component: (
              <FormTreeSelect
                field='parent_id'
                fetchOptions={(node) => {
                  return dispatch(getOptionsGlobal('regimeType', node)).then((res) => {
                    return mapDataOptions4Select(res);
                  });
                }}
                allowClear={true}
                treeDataSimpleMode
                placeholder='--Chọn--'
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

export default RegimeTypeFilter;
