import React, { useEffect, useState, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
//service
import { getOptionsStocksInType } from 'services/stocks-in-type.service';
import { getOptionsStocks } from 'services/stocks.service';
import { getOptionsUser } from 'services/users.service';
//component
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

//utils
import { mapDataOptions4SelectCustom, mapDataOptions4Select } from 'utils/helpers';
import { deletedStatusOption, stockInStatusOption } from 'utils/helpers';
import { reviewStatusOption } from './utils/constants';
const { RangePicker } = DatePicker;

const StocksInRequestFilter = ({ onChange, onClearParams }) => {
  const methods = useForm();
  const [dateRange, changeDateRange] = useState(null);

  const [optionsStocksInType, setOptionsStocksInType] = useState([]);
  const [optionsStocks, setOptionsStocks] = useState([]);
  const getDataOptions = useCallback(() => {
    getOptionsStocksInType().then((data) => {
      setOptionsStocksInType(mapDataOptions4SelectCustom(data));
    });
    getOptionsStocks().then((data) => {
      setOptionsStocks(mapDataOptions4SelectCustom(data));
    });
  }, []);
  useEffect(getDataOptions, [getDataOptions]);

  const initFilter = {
    search: '',
    is_reviewed: 4,
    is_imported: 2,
    is_deleted: 0,
    create_date_from: null,
    create_date_to: null,
    created_user: null,
  };

  useEffect(() => {
    methods.reset({
      is_reviewed: 4,
      is_imported: 2,
      is_deleted: 0,
      search: '',
    });
  }, []);

  const onClear = () => {
    methods.reset(initFilter);
    onClearParams(initFilter);
    changeDateRange(null);
    onChange(initFilter);
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
  const getOptsUser = async (payload) => {
    return mapDataOptions4SelectCustom(await getOptionsUser({ auth_name: payload }));
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
            component: <FormInput field='search' placeholder='Tên sản phẩm, mã sản phẩm, mã imei, Số phiếu yêu cầu' />,
          },
          {
            title: 'Hình thức phiếu nhập',
            component: <FormSelect field='stocks_in_type_id' list={optionsStocksInType} />,
          },
          {
            title: 'Trạng thái phiếu nhập',
            component: <FormSelect field='is_imported' list={stockInStatusOption} />,
          },
          {
            title: 'Trạng thái duyệt',
            component: <FormSelect field='is_reviewed' list={reviewStatusOption} />,
          },
          {
            title: 'Kho nhập',
            component: <FormSelect field='stocks_id' list={optionsStocks} />,
          },
          {
            title: 'Người lập phiếu',
            component: (
              <FormDebouneSelect
                field='created_user'
                placeholder='--Chọn--'
                fetchOptions={getOptsUser}
                style={{
                  width: '100%',
                }}
              />
            ),
          },

          {
            title: 'Ngày lập phiếu',
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
            title: 'Đã xóa',
            component: <FormSelect field='is_deleted' list={deletedStatusOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default StocksInRequestFilter;
