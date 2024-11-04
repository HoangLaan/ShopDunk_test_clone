import React, { useEffect, useState } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { statusTypesOption } from 'utils/helpers';
import { STATUS_TYPES } from 'utils/constants';

import dayjs from 'dayjs';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const CustomerFilter = ({ onChange }) => {
  const methods = useForm({ defaultValues: { is_active: 1 } });
  const [dateRange, changeDateRange] = useState(null);
  useEffect(() => {
    methods.register('is_active');
  }, [methods.register]);

  const handleChangeDate = (date, dateString) => {
    if (Boolean(dateString[0] && dateString[1])) {
      changeDateRange(returnMomentDateRange(dateString[0], dateString[1]));
      methods.setValue('date_from', dateString[0]);
      methods.setValue('date_to', dateString[1]);
    } else {
      changeDateRange(null);
    }
  };

  const returnMomentDateRange = (start, finish) => {
    return [dayjs(start, 'DD/MM/YYYY'), dayjs(finish, 'DD/MM/YYYY')];
  };

  const onClear = () => {
    methods.reset({
      keyword: null,
      date_from: null,
      date_to: null,
      is_active: STATUS_TYPES.ACTIVE,
    });

    onChange({
      keyword: null,
      date_from: null,
      date_to: null,
      is_active: STATUS_TYPES.ACTIVE,
    });
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        colSize={4}
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear()}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='keyword' placeholder={'Tên ca làm việc'} />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <RangePicker
                allowClear={true}
                onChange={handleChangeDate}
                format='DD/MM/YYYY'
                fieldStart='date_from'
                fieldEnd='date_to'
                bordered={false}
                style={{ width: '100%' }}
                placeholder={['dd/mm/yyyy', 'dd/mm/yyyy']}
                value={dateRange ? dateRange : ''}
              />
            ),
          },

          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' id='is_active' list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default CustomerFilter;
