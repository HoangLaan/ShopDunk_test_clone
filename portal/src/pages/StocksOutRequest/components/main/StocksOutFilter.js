import React, { useCallback, useEffect, useState } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import {
  getOptionStocks,
  getOptionsListStockOuttypeRequest,
  getListCreateUserOptions,
} from 'services/stocks-out-request.service';
import { outTypeOptions, reviewTypeOptions } from 'pages/StocksOutRequest/utils/helper';
import { FormProvider, useForm } from 'react-hook-form';
import { mapDataOptions4SelectCustom } from 'utils/helpers';

const StocksOutFilter = ({ onChange, onClear,setIsFilterPreOder }) => {
  const methods = useForm();
  const [listStockOutType, setListStockOutType] = useState([]);
  const [listStock, setListStock] = useState([]);

  useEffect(() => {
    methods.reset({
      is_active: 1,
      is_deleted : 0
    });
  }, []);
  useEffect(()=>{
    return methods.watch('stocks_out_type_id') == 18 ?  setIsFilterPreOder(true) :  setIsFilterPreOder(false)
  },methods.watch('stocks_out_type_id'))

  const loadListStockOutType = useCallback(() => {
    getOptionsListStockOuttypeRequest()
      .then((e) => setListStockOutType(e?.items))
      .catch((_) => {})
      .finally(() => {});
  }, []);
  useEffect(loadListStockOutType, [loadListStockOutType]);

  const loadListStock = useCallback(() => {
    getOptionStocks()
      .then((e) => setListStock(e))
      .catch((_) => {})
      .finally(() => {});
  }, []);
  useEffect(loadListStock, [loadListStock]);

  const loadCreatedUserList = useCallback((value) => {
    // value return tu input
    return getListCreateUserOptions({
      keyword: value,
    }).then((body) =>
      body.map((user) => ({
        label: user?.user_name + '-' + user?.full_name,
        value: user?.user_name,
      })),
    );
  }, []);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Từ khóa'
        onSubmit={onChange}
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập số phiếu xuất, tên sản phẩm, mã sản phẩm , mã imei, Số Phiếu yêu cầu' />,
          },
          {
            title: 'Trạng thái duyệt',
            component: <FormSelect field='is_review' list={reviewTypeOptions} />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormRangePicker
                allowClear={true}
                fieldStart='from_date'
                fieldEnd='to_date'
                placeholder={['Từ ngày', 'Đến ngày']}
                format='DD/MM/YYYY'
              />
            ),
          },
          {
            title: 'Hình thức phiếu xuất',
            component: (
              <FormSelect
                field='stocks_out_type_id'
                list={mapDataOptions4SelectCustom(listStockOutType, 'stocks_out_type_id', 'stocks_out_type_name')}
              />
            ),
          },
          {
            title: 'Trạng thái phiếu xuất',
            component: <FormSelect field='is_outputted' list={outTypeOptions} />,
          },
          {
            title: 'Đã xóa',
            component: (
              <FormSelect
                field='is_deleted'
                list={[
                  {
                    label: 'Tất cả',
                    value: 2,
                  },
                  {
                    label: 'Có',
                    value: 1,
                  },
                  {
                    label: 'Không',
                    value: 0,
                  },
                ]}
              />
            ),
          },
          {
            title: 'Kho xuất',
            component: <FormSelect field='stocks_id' list={mapDataOptions4SelectCustom(listStock)} />,
          },
          {
            title: 'Người lập phiếu',
            component: (
              <FormDebouneSelect
                placeholder='Chọn người lập phiếu'
                field='created_user'
                fetchOptions={loadCreatedUserList}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default StocksOutFilter;
