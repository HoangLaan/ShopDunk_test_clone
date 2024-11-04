import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import { DatePicker } from 'antd';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { statusTypesOption } from 'utils/helpers';
// import optionNewsType from '../constant';

const { RangePicker } = DatePicker;

const NewsFilter = ({ onChange }) => {
  const methods = useForm();
  const [dateRange, changeDateRange] = useState(null);

  // useEffect(() => {
  //   methods.reset({
  //     is_active: 1,
  //     //   news_type: null,
  //   });
  // }, [methods]);

  const onClear = () => {
    methods.reset({
      search: '',
      is_active: 1,
      create_date_from: null,
      create_date_to: null,
      //   news_type: null,
    });
    changeDateRange(null);
    onChange({
      search: '',
      is_active: 1,
      create_date_from: null,
      create_date_to: null,
      //   news_type: null,
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
            component: <FormInput field='search' placeholder='Tên trang tĩnh' />,
          },
          // {
          //     title: 'Loại tin tức',
          //     component:
          //         <FormSelect
          //             field='news_type'
          //             list={optionNewsType}
          //         />,
          // },
          {
            title: 'Ngày tạo',
            component: (
              <RangePicker
                allowClear={true}
                onChange={handleChangeDate}
                style={{ width: '100%' }}
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

export default NewsFilter;
