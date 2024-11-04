import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import { DatePicker } from 'antd';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { statusTypesOption } from 'utils/helpers';

import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

const LevelFilter = ({ onChange }) => {
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
        onClear={() =>
          onChange({
            search: '',
            is_active: 1,
            created_date_from: null,
            created_date_to: null,
            page: 1,
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập tên trình độ kỹ năng' />,
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

export default LevelFilter;
