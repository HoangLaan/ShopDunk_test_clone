import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { notification } from 'antd';

import {
  statusTypesOption,
  budgetCreationOption,
  mapDataOptions4Select,
  mapDataOptions4SelectCustom,
} from 'utils/helpers';
import { useDispatch } from 'react-redux';

import {} from '../../../services/global.service';
import { getOptionsGlobal } from 'actions/global';
import { getParentOptions } from 'services/item.service';

const { RangePicker } = DatePicker;

const ItemFilter = ({ onChange }) => {
  const methods = useForm({ defaultValues: { is_active: 2, is_budget_creation: 2 } });
  const dispatch = useDispatch();
  const [dateRange, changeDateRange] = useState(null);
  const [companyOptions, setCompanOptions] = useState([]);
  const [parentItemOptions, setParentItemOptions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const companys = await getOptionsGlobal('company')(dispatch);
      setCompanOptions(mapDataOptions4SelectCustom(companys));

      const _perentOptions = await getParentOptions();
      setParentItemOptions(mapDataOptions4SelectCustom(_perentOptions));
    } catch (error) {
      notification.error({ message: error.message || 'Lỗi lấy dữ liệu.' });
    }
  };

  const handleChangeDate = (date, dateString) => {
    if (Boolean(dateString[0] && dateString[1])) {
      changeDateRange(returnMomentDateRange(dateString[0], dateString[1]));
      methods.setValue('created_date_from', dateString[0]);
      methods.setValue('created_date_to', dateString[1]);
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
      is_active: 2,
      created_date_from: null,
      created_date_to: null,
      is_budget_creation: 2,
    });

    onChange({
      search: '',
      is_active: 2,
      created_date_from: null,
      created_date_to: null,
      is_budget_creation: 2,
    });
    changeDateRange(null);
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm khoản mục'
        onSubmit={onChange}
        onClear={() => onClear()}
        colSize={4}
        expanded
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder={'Nhập mã khoản mục, tên khoản mục'} />,
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
            title: 'Kích hoạt',
            component: <FormSelect field='is_active' id='is_active' list={statusTypesOption} />,
          },
          {
            title: 'Thuộc khoản mục',
            component: <FormSelect field='parent_id' id='parent_id' list={parentItemOptions} />,
          },
          {
            title: 'Lập ngân sách',
            component: <FormSelect field='is_budget_creation' id='is_budget_creation' list={budgetCreationOption} />,
          },
          {
            title: 'Công ty áp dụng',
            component: <FormSelect field='company_id' id='company_id' list={companyOptions} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default ItemFilter;
