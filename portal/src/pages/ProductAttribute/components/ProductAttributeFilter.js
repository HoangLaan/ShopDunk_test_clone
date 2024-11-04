import React, { useEffect, useState, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';

// service
import { getOptionsUnit } from 'services/unit.service';
//util
import { statusTypesOption, mapDataOptions4SelectCustom } from 'utils/helpers';
import { optionsAttributeFilter } from 'pages/ProductAttribute/helper/index';
//components
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

const { RangePicker } = DatePicker;

const ProductAttributeFilter = ({ onChange }) => {
  const methods = useForm();
  const [dateRange, changeDateRange] = useState(null);
  const [optionsUnit, setOptionsUnit] = useState();

  const getUnit = useCallback(() => {
    getOptionsUnit().then((data) => {
      setOptionsUnit(mapDataOptions4SelectCustom(data));
    });
  }, []);
  useEffect(getUnit, [getUnit]);

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  const onClear = () => {
    methods.reset({
      search: '',
      is_active: 1,
      from_date: null,
      to_date: null,
      attribute_type: null,
      unit_id: null,
      page: 1
    });
    changeDateRange(null);
    onChange({
      search: '',
      is_active: 1,
      from_date: null,
      to_date: null,
      attribute_type: null,
      unit_id: null,
      page: 1
    });
  };
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

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập tên thuộc tính' />,
          },
          {
            title: 'Loại thuộc tính',
            component: <FormSelect field='attribute_type' list={optionsAttributeFilter} />,
          },
          {
            title: 'Đơn vị tính',
            component: <FormSelect field='unit_id' list={optionsUnit} />,
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

export default ProductAttributeFilter;
