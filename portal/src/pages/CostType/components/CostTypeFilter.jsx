import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';

import { statusTypesOption } from 'utils/helpers';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

const { RangePicker } = DatePicker;

const CostTypeFilter = ({ onChange }) => {
  const methods = useForm();
  const [dateRange, changeDateRange] = useState(null);

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  const onClear = () => {
    methods.reset({
      search: '',
      is_active: 1,
      from_date: null,
      to_date: null,
    });

    changeDateRange(null);

    onChange({
      search: '',
      is_active: 1,
      from_date: null,
      to_date: null,
    });
  };

  const handleChangeDate = (date, dateString) => {
    if (dateString[0] && dateString[1]) {
      changeDateRange(returnMomentDateRange(dateString[0], dateString[1]));
      methods.setValue('from_date', dateString[0]);
      methods.setValue('to_date', dateString[1]);
    } else {
      methods.setValue('from_date', null);
      methods.setValue('to_date', null);
      changeDateRange(null);
    }
  };
  const returnMomentDateRange = (start, finish) => {
    return [dayjs(start, 'DD/MM/YYYY'), dayjs(finish, 'DD/MM/YYYY')];
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={(v) => {
          methods.setValue('search', v.search?.trim());
          onChange(v);
        }}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập tên loại chi phí' maxLength={250} />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <RangePicker
                allowClear={true}
                onChange={handleChangeDate}
                format='DD/MM/YYYY'
                bordered={false}
                placeholder={['dd/mm/yyyy', 'dd/mm/yyyy']}
                value={dateRange ? dateRange : ''}
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

export default CostTypeFilter;
