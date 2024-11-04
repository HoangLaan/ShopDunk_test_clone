import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { FormProvider, useForm } from 'react-hook-form';
import { DatePicker } from 'antd';

import { statusTypesOption } from 'utils/helpers';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

const { RangePicker } = DatePicker;

const CustomerFilter = ({ onChange }) => {
  const methods = useForm({ defaultValues: { is_active: 2 } });
  const { register } = methods;
  const [dateRange, changeDateRange] = useState(null);

  useEffect(() => {
    register('is_active');
  }, [register]);

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
      search: '',
      is_active: 2,
      date_from: null,
      date_to: null,
    });
    onChange({
      search: '',
      is_active: 2,
      date_from: null,
      date_to: null,
    });
    changeDateRange(null);
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm mức duyệt'
        onSubmit={onChange}
        onClear={() => onClear({})}
        colSize={4}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder={'Nhập tên mức duyệt'} />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <RangePicker
                allowClear={true}
                onChange={handleChangeDate}
                format='DD/MM/YYYY'
                bordered={false}
                style={{ width: '100%' }}
                placeholder={['dd/mm/yyyy', 'dd/mm/yyyy']}
                value={dateRange ? dateRange : ''}
              />
            ),
          },

          {
            title: 'Kích hoạt',
            component: <FormSelect field='is_active' id='is_active' list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default CustomerFilter;
