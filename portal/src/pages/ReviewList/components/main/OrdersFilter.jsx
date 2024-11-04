import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { defaultValueFilter } from 'pages/ReviewList/helpers/constans';

import { setOrdersQuery } from 'pages/ReviewList/actions/actions';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
const { RangePicker } = DatePicker;

const typeRatings = [
  {
    label: 'Tất cả',
    value: 1,
  },
  {
    label: '1',
    value: 1,
  },
  {
    label: '2',
    value: 2,
  },
  {
    label: '3',
    value: 3,
  },
  {
    label: '4',
    value: 4,
  },
  {
    label: '5',
    value: 5,
  },
];
const OrdersFilter = ({ disabled }) => {
  const dispatch = useDispatch();

  const { query: params } = useSelector((state) => state.review);
  const methods = useForm({ defaultValues: params || [] });

  const [dateRange, changeDateRange] = useState(null);

  const handleChangeDate = (date, dateString) => {
    if (Boolean(dateString[0] && dateString[1])) {
      changeDateRange(returnMomentDateRange(dateString[0], dateString[1]));
      methods.setValue('from_date', dateString[0]);
      methods.setValue('to_date', dateString[1]);
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

    onChangeSubmit(defaultValueFilter);
  };

  const onChangeSubmit = (value) => {
    if (!disabled) dispatch(setOrdersQuery({ ...params, ...value }));
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChangeSubmit}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder={'Tên khách hàng, tên dịch vụ, nội dung đánh giá'} />,
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
            title: 'Rating',
            component: <FormSelect field='rating' id='rating' list={typeRatings} allowClear={true} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default OrdersFilter;
