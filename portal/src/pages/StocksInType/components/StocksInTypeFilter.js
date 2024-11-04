import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import { DatePicker } from 'antd';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { statusTypesOption } from 'utils/helpers';

const { RangePicker } = DatePicker;

const StocksInTypeFilter = ({ onChange }) => {
  const methods = useForm();
  const [dateRange, changeDateRange] = useState(null);

  const stocksInTypeOptions = useMemo(
    () => [
      { label: 'Tất cả', value: 7 },
      { label: 'Nhập điều chuyển', value: 0 },
      { label: 'Nhập hàng mới', value: 1 },
      { label: 'Nhập hàng thừa kiểm kê', value: 2 },
      { label: 'Nhập trả hàng lại', value: 3 },
      { label: 'Nhập bảo hành', value: 4 },
      { label: 'Nhập thu cũ', value: 5 },
      { label: 'Nhập nội bộ', value: 6 },
    ],
    [],
  );

  useEffect(() => {
    methods.reset({
      is_active: 1,
      stocks_in_type: 7,
    });
  }, [methods]);

  const onClear = () => {
    methods.reset({
      search: '',
      is_active: 1,
      create_date_from: null,
      create_date_to: null,
      stocks_in_type: 7,
    });
    changeDateRange(null);
    onChange({
      search: '',
      is_active: 1,
      create_date_from: null,
      create_date_to: null,
      stocks_in_type: 7,
    });
  };

  const handleChangeDate = (date, dateString) => {
    if (Boolean(dateString[0] && dateString[1])) {
      changeDateRange(returnMomentDateRange(dateString[0], dateString[1]));
      methods.setValue('create_date_from', dateString[0]);
      methods.setValue('create_date_to', dateString[1]);
    } else {
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
        onSubmit={onChange}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder={'Nhập tên hình thức phiếu nhập'} field='search' />,
          },
          {
            title: 'Loại hình thức',
            component: <FormSelect field='stocks_in_type' list={stocksInTypeOptions} />,
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

export default StocksInTypeFilter;
