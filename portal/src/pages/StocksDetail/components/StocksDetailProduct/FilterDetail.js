import React, { useEffect, useState, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
//service
import { getOptionsStocks } from 'services/stocks.service';
import { getOptionsUser } from 'services/users.service';
import { getOptionsSupplier } from 'services/stocks-in-request.service';
import { getOptionsUserImport } from 'services/stocks-detail.service';
//component
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

//utils
import { mapDataOptions4SelectCustom, mapDataOptions4Select } from 'utils/helpers';
import { deletedStatusOption, reviewStatusOption, stockInStatusOption } from 'utils/helpers';
import '../../style.scss';
const { RangePicker } = DatePicker;

const FilterDetail = ({ onChange, onClearParams }) => {
  const methods = useForm();
  const [dateRange, changeDateRange] = useState(null);
  const [optionsSupplier, setOptionsSupplier] = useState([]);

  const getDataOptions = useCallback(() => {
    getOptionsSupplier().then((data) => {
      setOptionsSupplier(mapDataOptions4SelectCustom(data));
    });
  }, []);
  useEffect(getDataOptions, [getDataOptions]);

  useEffect(() => {
    methods.reset({
      is_out_of_stock: 1,
    });
  }, []);

  const initFilter = {
    search: null,
    is_out_of_stock: 1,
    from_date: null,
    to_date: null,
    user_name: null,
    unit_id: null,
    num_days_from: null,
    num_days_to: null,
    is_over_time_inventory: null,
  };

  const onClear = () => {
    methods.reset(initFilter);
    onClearParams(initFilter);
    changeDateRange(null);
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
  const getOptsUser = async (payload) => {
    return mapDataOptions4SelectCustom(await getOptionsUserImport({ user_name: payload }));
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear({ search: '' })}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput type='text' field='search' placeholder='Nhập mã IMEI, số phiếu nhập, số lô, Ghi chú' />
            ),
          },
          {
            title: 'Nhà cung cấp',
            component: <FormSelect field='supplier_id' list={optionsSupplier} />,
          },
          {
            title: 'Ngày nhập kho',
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
            title: 'Người nhập kho',
            component: (
              <FormDebouneSelect
                field='user_name'
                placeholder='--Chọn--'
                fetchOptions={getOptsUser}
                style={{
                  width: '100%',
                }}
                labelInValue={false}
              />
            ),
          },
          {
            title: 'Số ngày tồn kho',
            component: (
              <div className='bw_flex'>
                <FormInput field='num_days_from' type='text' placeholder='Từ' className='stocks_inp_w5' />
                <FormInput field='num_days_to' type='text' placeholder='Đến' className='stocks_inp_w5' />
              </div>
            ),
          },
          {
            title: 'Tồn kho',
            component: <FormSelect field='is_out_of_stock' list={deletedStatusOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default FilterDetail;
