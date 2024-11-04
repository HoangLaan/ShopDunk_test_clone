import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import { DatePicker } from 'antd';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { statusTypesOption } from 'utils/helpers';

const { RangePicker } = DatePicker;

const StocksOutTypeFilter = ({ onChange }) => {
  const methods = useForm();
  const [dateRange, changeDateRange] = useState(null);

  const stocksOutTypeOptions = [
    { label: 'Tất cả', value: 11 },
    { label: 'Xuất nội bộ', value: 1 },
    { label: 'Xuất bán', value: 2 },
    { label: 'Xuất đổi hàng', value: 3 },
    { label: 'Xuất bảo hành', value: 4 },
    { label: 'Xuất trả NCC', value: 5 },
    { label: 'Xuất điều chuyển', value: 6 },
    { label: 'Xuất đền bù mất hàng', value: 7 },
    { label: 'Xuất rã lấy linh kiện', value: 8 },
    { label: 'Xuất hủy', value: 9 },
    { label: 'Xuất kho công ty', value: 10 },

  ];

  useEffect(() => {
    methods.reset({
      is_active: 1,
      stocks_out_type: 11,
    });
  }, [methods]);

  const onClear = () => {
    methods.reset({
      search: '',
      is_active: 1,
      create_date_from: null,
      create_date_to: null,
      stocks_out_type: 11,
    });
    changeDateRange(null);
    onChange({
      search: '',
      is_active: 1,
      create_date_from: null,
      create_date_to: null,
      stocks_out_type: 11,
    });
  };

  const handleChangeDate = (date, dateString) => {
    if (Boolean(dateString[0] && dateString[1])) {
      changeDateRange(returnMomentDateRange(dateString[0], dateString[1]));
      methods.setValue('create_date_from', dateString[0]);
      methods.setValue('create_date_to', dateString[1]);
    } else {
      changeDateRange(null);
      methods.reset((prev) => ({
        ...prev,
        create_date_from: null,
        create_date_to: null,
      }));
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
            component: <FormInput field='search' placeholder='Nhập tên hình thức phiếu xuất' />,
          },
          {
            title: 'Loại hình thức',
            component: <FormSelect field='stocks_out_type' list={stocksOutTypeOptions} />,
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

export default StocksOutTypeFilter;
