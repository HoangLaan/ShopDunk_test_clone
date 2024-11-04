import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { mapDataOptions4SelectCustom, statusTypesOption } from 'utils/helpers';
import { vatTypes } from 'pages/OutputType/utils/helpers';
import { getOptionsGlobal, showConfirmModal } from 'actions/global';
import { useDispatch, useSelector } from 'react-redux';

const { RangePicker } = DatePicker;

const OutputTypeFilter = ({ onChange }) => {
  const methods = useForm({ defaultValues: { is_active: 1, is_vat: 2 } });
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
      is_active: 1,
      date_from: null,
      date_to: null,
      is_vat: 2,
    });
    onChange({
      search: '',
      is_active: 1,
      date_from: null,
      date_to: null,
      is_vat: 2,
    });
    changeDateRange(null);
  };

  const dispatch = useDispatch();
  const { areaData, businessData } = useSelector((state) => state.global);

  useEffect(() => {
    if (!areaData) dispatch(getOptionsGlobal('area'));
  }, [areaData, dispatch]);

  useEffect(() => {
    if (!businessData) dispatch(getOptionsGlobal('business'));
  }, [businessData, dispatch]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder={'Nhập tên hình thức xuất bán'} />,
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
            title: 'Có VAT',
            component: <FormSelect field='is_vat' id='is_vat' list={vatTypes} />,
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' id='is_active' list={statusTypesOption} />,
          },
          {
            title: 'Khu vực',
            component: <FormSelect field='area_id' id='area_id' list={mapDataOptions4SelectCustom(areaData)} />,
          },
          {
            title: 'Miền',
            component: (
              <FormSelect field='business_id' id='business_id' list={mapDataOptions4SelectCustom(businessData)} />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default OutputTypeFilter;
