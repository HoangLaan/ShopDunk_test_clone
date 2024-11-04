import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { getStocksOptions } from 'services/stocks-detail.service';
import { mapDataOptions4SelectCustom } from 'utils/helpers';

function InfoStocksSetting({ disabled, setShowModal, onRefresh, stocksTypeOpts }) {
  const methods = useFormContext();
  const { handleSubmit, reset, setValue, watch } = methods;

  const mapSelectIds = useCallback((list = []) => {
    if (!Array.isArray(list)) list = [list];
    return list.map((item) => item.id ?? item.value ?? item)?.join('|');
  }, []);
  // const stocksTypeOpts = useGetOptions(optionType.stockTypeByStore, {
  //   params: { parent_id: mapSelectIds(watch('store_ids_settings')) },
  // });

  const businessOpts = useGetOptions(optionType.business);
  const storeOpts = useGetOptions(optionType.storeByBusiness, {
    params: { parent_id: mapSelectIds(watch('business_ids_settings')) },
  });

  // const stocksOpts = useGetOptions(optionType.stocks, {
  //   params: { parent_id: mapSelectIds(watch('stocks_type_list_settings')) },
  // });

  const [stocksOpts, setStocksOptions] = useState([]);
  const stocks_type_list_settings = watch('stocks_type_list_settings');
  const store_ids_settings = watch('store_ids_settings');

  useEffect(() => {
    getStocksOptions({
      stocks_type_ids: mapSelectIds(stocks_type_list_settings),
      store_ids: mapSelectIds(store_ids_settings),
    }).then((data) => {
      setStocksOptions(mapDataOptions4SelectCustom(data));
    });
  }, [stocks_type_list_settings, store_ids_settings]);

  return (
    <>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Chi nhánh'>
            <FormSelect
              mode='multiple'
              field='business_ids_settings'
              placeholder='Chọn'
              list={businessOpts}
              // validation={{
              //   required: 'Chi nhánh là bắt buộc',
              // }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Cửa hàng'>
            <FormSelect
              mode='multiple'
              field='store_ids_settings'
              placeholder='Chọn'
              list={storeOpts}
              // validation={{
              //   required: 'Cửa hàng là bắt buộc',
              // }}
            />
          </FormItem>
        </div>
      </div>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Loại kho'>
            <FormSelect
              mode='multiple'
              field='stocks_type_list_settings'
              placeholder='Chọn'
              list={stocksTypeOpts}
              // validation={{
              //   required: 'Loại kho là bắt buộc',
              // }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Danh sách kho'>
            <FormSelect mode='multiple' field='stocks_ids_settings' placeholder='Chọn' list={stocksOpts} />
          </FormItem>
        </div>
      </div>
    </>
  );
}

export default InfoStocksSetting;
