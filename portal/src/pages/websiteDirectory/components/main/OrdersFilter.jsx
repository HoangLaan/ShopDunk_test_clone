import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { defaultValueFilter } from 'pages/websiteDirectory/helpers/constans';
import { setOrdersQuery } from 'pages/websiteDirectory/actions/actions';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
const { RangePicker } = DatePicker;

const typeWebsite = [
  {
    label: 'Tất cả',
    value: 0,
  },
  {
    label: 'SD Care',
    value: 1,
  },
];

const typeStatus = [
  {
    label: 'Tất cả',
    value: 1,
  },
  {
    label: 'Hiển thị',
    value: 2,
  },
  {
    label: 'Ẩn',
    value: 3,
  },
];
const OrdersFilter = ({ setDataReportSearch, disabled }) => {
  const dispatch = useDispatch();

  const { query: params } = useSelector((state) => state.website);
  const methods = useForm({ defaultValues: params || [] });

  const [dateRange, changeDateRange] = useState(null);

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

  const onClear = () => {
    if (disabled) return;

    methods.reset(defaultValueFilter);
    changeDateRange(null);

    onChange(defaultValueFilter);
  };

  const onChange = (value) => {
    if (!disabled) dispatch(setOrdersQuery({ ...params, ...value }));
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
            component: <FormInput field='keyword' placeholder={'Tên danh mục website'} />,
          },
          {
            title: 'Website',
            component: <FormSelect field='website_id' id='website_id' list={typeWebsite} allowClear={true} />,
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
            title: 'Trạng thái',
            component: <FormSelect field='is_active' id='is_active' list={typeStatus} allowClear={true} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default OrdersFilter;
