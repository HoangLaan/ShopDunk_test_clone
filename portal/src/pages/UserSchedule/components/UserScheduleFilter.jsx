import React, { useEffect, useState } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
//utils
import { mapDataOptions4SelectCustom, mapDataOptions4Select } from 'utils/helpers';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import moment from 'moment';

const { RangePicker } = DatePicker;

const CustomerFilter = ({ initFilter, onChange, dataUserSchedule, onClearParams }) => {
  let { data_shift = [], data_store = [], data_business = [] } = dataUserSchedule;

  const [dataShift, setDataShift] = useState([]);
  const [dataStore, setDataStore] = useState([]);
  const [dataBusiness, setDataBusiness] = useState([]);

  const reviewStatusOption = [
    {
      label: 'Tất cả',
      value: 4,
    },
    {
      label: 'Đã duyệt',
      value: 1,
    },
    {
      label: 'Không duyệt',
      value: 0,
    },
    {
      label: 'Chờ duyệt',
      value: 2,
    },
    {
      label: 'Tự động duyệt',
      value: 3,
    },
  ];

  const defaultFilter = {
    page: 1,
    itemsPerPage: 25,
    keyword: '',
    is_active: 1,
    date_from: moment().startOf('month').format('DD/MM/YYYY'),
    date_to: moment().format('DD/MM/YYYY'),
    is_review: 4,
  };

  const methods = useForm({ defaultValues: initFilter });
  const { watch } = methods;
  const [dateRange, changeDateRange] = useState(null);

  useEffect(() => {
    onChange(initFilter);
    changeDateRange(returnMomentDateRange(initFilter.date_from, initFilter.date_to));
  }, []);

  useEffect(() => {
    setDataShift(mapDataOptions4SelectCustom(data_shift, 'shift_id', 'shift_name'));
    setDataStore(mapDataOptions4SelectCustom(data_store, 'store_id', 'store_name'));
    setDataBusiness(mapDataOptions4Select(data_business));
  }, [dataUserSchedule]);

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
    methods.reset(defaultFilter);
    onClearParams(defaultFilter);
    changeDateRange(returnMomentDateRange(defaultFilter.date_from, defaultFilter.date_to));
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
            component: <FormInput field='keyword' placeholder={'Tên nhân viên, mã nhân viên'} />,
          },
          {
            title: 'Miền',
            component: <FormSelect field='business_id' id='business_id' list={dataBusiness} />,
          },
          {
            title: 'Cửa hàng',
            component: <FormSelect field='store_id' id='store_id' list={dataStore} />,
          },
          {
            title: 'Thời gian làm',
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
            title: 'Ca làm việc',
            component: <FormSelect field='shift_id' id='shift_id' list={dataShift} />,
          },
          {
            title: 'Trạng thái duyệt ca',
            component: <FormSelect field='is_review' id='is_review' list={reviewStatusOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default CustomerFilter;
