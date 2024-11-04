import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

import { mapDataOptions4Select } from 'utils/helpers';
import { getOutputTypeOpts } from 'services/output-type.service';

import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';

const { RangePicker } = DatePicker;

const PricesHistoryFilter = ({ onChange }) => {
  const methods = useForm({ defaultValues: { product_type_id: 1, is_active: 1, is_review: 4, status_apply_id: 1 } });
  const [dateRange, changeDateRange] = useState(null);
  const [outputTypeOpts, setOutputTypeOpts] = useState([]);

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

  const getInitOpts = useCallback(async () => {
    try {
      // lấy danh sách hình thức xuất bán
      const _outputTypeOpts = await getOutputTypeOpts();
      setOutputTypeOpts(mapDataOptions4Select(_outputTypeOpts));
    } catch (error) {}
  }, []);

  useEffect(() => {
    getInitOpts();
  }, [getInitOpts]);

  const onClear = () => {
    methods.reset({
      search: '',
      output_type_id: null,
      is_review: 4,
      date_from: null,
      date_to: null,
      product_type_id: 1,
      status_apply_id: 1,
      is_active: 1,
    });
    onChange({
      search: '',
      output_type_id: null,
      is_review: 4,
      date_from: null,
      date_to: null,
      product_type_id: 1,
      status_apply_id: 1,
      is_active: 1,
    });
    changeDateRange(null);
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm sản phẩm/linh kiện'
        onSubmit={onChange}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Hình thức xuất bán',
            component: <FormSelect field='output_type_id' id='output_type_id' list={outputTypeOpts} />,
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
        ]}
      />
    </FormProvider>
  );
};

export default PricesHistoryFilter;
