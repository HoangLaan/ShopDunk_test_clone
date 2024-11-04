import { DatePicker } from 'antd';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { mapDataOptions4Select } from 'utils/helpers';
import { getOffWorkTypeOpts } from '../helpers/call-api';
import { reviewStatusOptionOffWorK } from '../helpers/const';

const { RangePicker } = DatePicker;

const CustomerFilter = ({ onChange, methods }) => {
  // const methods = useForm({ defaultValues: { is_active: 1, status: 4 } });
  const [dateRange, changeDateRange] = useState(null);
  const [offWorkTypeOpts, setOffWorkTypeOpts] = useState([]);

  const getInitOptions = useCallback(async () => {
    let _offWorkTypeOpts = await getOffWorkTypeOpts();
    setOffWorkTypeOpts(mapDataOptions4Select(_offWorkTypeOpts));
  }, []);

  useEffect(() => {
    getInitOptions();
  }, [getInitOptions]);

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
      keyword: '',
      is_active: 1,
      date_from: null,
      date_to: null,
      type: null,
      status: 4,
    });
    changeDateRange(null);
    onChange({
      keyword: '',
      is_active: 1,
      date_from: null,
      date_to: null,
      type: null,
      status: 4,
    });
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm phép'
        onSubmit={onChange}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='keyword' placeholder={'Nhập tên hoặc mã nhân viên'} />,
          },
          {
            title: 'Loại phép',
            component: <FormSelect field='type' id='type' list={offWorkTypeOpts} />,
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
            component: <FormSelect field='status' id='status' list={reviewStatusOptionOffWorK} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default CustomerFilter;
