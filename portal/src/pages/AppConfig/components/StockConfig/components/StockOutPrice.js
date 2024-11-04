import React from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import dayjs from 'dayjs';
import FormTimePicker from 'components/shared/BWFormControl/FormTime';
import { mapDataOptions4Select } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';
import { toString } from 'lodash';
import { getOptionsStocks } from 'services/stocks.service';
import { getOptionsStore } from 'services/store.service';

const StockOutPrice = () => {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
  };

  const customToString = (data) => {
    data = mapDataOptions4Select(data);
    data.forEach((item) => {
      item.id = toString(item.id);
    });
    return data;
  };

  const handleChangeBussiness = (params) => {
    setValue('ST_COGS_BUSINESSIDS_SETTINGS', params);
    setValue('ST_COGS_STOREIDS_SETTINGS', []);
    setValue('ST_COGS_STOCKSIDS_SETTINGS', []);
    getOptionsStore({
      business_ids: watch('ST_COGS_BUSINESSIDS_SETTINGS').join(',') || null,
    }).then((data) => {
      setValue('store_option', customToString(data));
    });
  };

  const handleChangeStore = (params) => {
    setValue('ST_COGS_STOREIDS_SETTINGS', params);
    setValue('ST_COGS_STOCKSIDS_SETTINGS', []);
    getOptionsStocks({
      stock_type_id: methods.watch('ST_COGS_STOCKSTYPE_SETTINGS') || null,
      store_ids: methods.watch('ST_COGS_STOREIDS_SETTINGS').join(',') || null,
    }).then((data) => {
      setValue('stock_option', customToString(data));
    });
  };

  const handleChangeStockType = (params) => {
    setValue('ST_COGS_STOCKSTYPE_SETTINGS', params);
    setValue('ST_COGS_STOCKSIDS_SETTINGS', []);
    getOptionsStocks({
      stock_type_id: methods.watch('ST_COGS_STOCKSTYPE_SETTINGS') || null,
      store_ids: Array(methods.watch('ST_COGS_STOREIDS_SETTINGS')).join(',') || null,
    }).then((data) => {
      setValue('stock_option', customToString(data));
    });
  };

  return (
    <BWAccordion title='Cài đặt tính giá xuất kho' id='bw_stock_out_price_config' isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem label='Chi nhánh tính giá xuất kho' isRequired={true} disabled={false}>
            <FormSelect
              field='ST_COGS_BUSINESSIDS_SETTINGS'
              list={mapDataOptions4Select(watch('bussiness_option'))}
              mode={'tags'}
              onChange={handleChangeBussiness}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Kho cần tính giá xuất kho' isRequired={true} disabled={watch('ST_COGS_STOREIDS_SETTINGS')?.length == 0}>
            <FormSelect
              field='ST_COGS_STOCKSIDS_SETTINGS'
              mode={'tags'}
              list={mapDataOptions4Select(watch('stock_option'))}
              onChange={(params)=>{
                setValue('ST_COGS_STOCKSIDS_SETTINGS', params)
              }}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Hàng hóa được chọn để tính giá xuất kho' isRequired={true} disabled={false}>
            <FormSelect
              field='ST_COGS_PRODUCTIDS_SETTINGS'
              list={mapDataOptions4Select(watch('product_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Ngày bắt đầu tính giá xuất kho' isRequired={true} disabled={false}>
            <FormDatePicker
              format={'DD/MM/YYYY'}
              field={'ST_COGS_STARTDATE_SETTINGS'}
              // validation={{
              //   required: 'Ngày/Tháng/Năm sinh là bắt buộc.',
              // }}
              placeholder={'dd/mm/yyyy'}
              style={{
                width: '100%',
              }}
              bordered={false}
              allowClear
              disabledDate={disabledDate}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Cửa hàng cần tính giá xuất kho' isRequired={true} disabled={watch('ST_COGS_BUSINESSIDS_SETTINGS')?.length == 0}>
            <FormSelect
              field='ST_COGS_STOREIDS_SETTINGS'
              mode={'tags'}
              list={mapDataOptions4Select(watch('store_option'))}
              onChange={handleChangeStore}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Thời gian tính giá xuất kho' isRequired={true} disabled={false}>
            <FormTimePicker
              field={'ST_COGS_CALCULATEDATE_SETTINGS'}
              type='time'
              format='HH:mm'
              placeholder='Chọn giờ'
              style={{
                width: '100%',
              }}
              bordered={false}
              allowClear
            />
          </FormItem>
          <FormItem label='Ngày kết thúc tính giá xuất kho' isRequired={true} disabled={false}>
            <FormDatePicker
              format={'DD/MM/YYYY'}
              field={'ST_COGS_ENDDATE_SETTINGS'}
              // validation={{
              //   required: 'Ngày/Tháng/Năm sinh là bắt buộc.',
              // }}
              placeholder={'dd/mm/yyyy'}
              style={{
                width: '100%',
              }}
              bordered={false}
              allowClear
              disabledDate={disabledDate}
            />
          </FormItem>
          <FormItem label='Thời gian service tính giá xuất kho chạy' isRequired={true} disabled={false}>
            <FormTimePicker
              field={'ST_COGS_TIMECALCULATING_SETTINGS'}
              type='time'
              format='HH:mm'
              placeholder='Chọn giờ'
              style={{
                width: '100%',
              }}
              bordered={false}
              allowClear
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Loại kho cần tính giá xuất kho' isRequired={true} disabled={false}>
            <FormSelect
              field='ST_COGS_STOCKSTYPE_SETTINGS'
              list={mapDataOptions4Select(watch('stock_type_option'))}
              onChange={handleChangeStockType}
            />
          </FormItem>
          <FormItem label='Hàng hóa cần tính giá xuất kho' isRequired={true} disabled={false}>
            <FormSelect
              field='ST_COGS_ISALLPRODUCT_SETTINGS'
              list={mapDataOptions4Select(watch('product_option'))}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default StockOutPrice;
