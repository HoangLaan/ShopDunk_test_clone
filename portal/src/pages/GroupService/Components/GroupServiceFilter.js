import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { statusTypesOption, showWebTypesOption } from 'utils/helpers';
import FilterSearchBar from 'components/shared/FilterSearchBar';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from './FormDateRangeCustom';


const GroupServiceFilter = ({ onChange }) => {

  const methods = useForm();

  const onClear = () => {

    methods.reset({
      search: '',
      keyword: '',
      is_active: 2,
      is_show_web: 2,
      created_date_from: null,
      created_date_to: null
    })
    // changeDateRange(null)
    onChange({
      search: '',
      keyword: '',
      is_active: 2,
      is_show_web: 2,
      created_date_to: null,
      created_date_from: null
    })
  }

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}

        onClear={() => onClear()}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder={'Mã, tên nhóm dịch vụ, ngành hàng'} />,
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          },
          {
            title: 'Hiển thị web',
            component: <FormSelect field='is_show_web' list={showWebTypesOption} />,
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
              // validation={{
              //   // required: 'Ngày bắt đầu và kết thúc là bắt buộc',

              // }}
              />
            ),
          }
        ]}
      />
    </FormProvider>
  );
};

export default GroupServiceFilter