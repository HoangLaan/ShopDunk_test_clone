import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import {
  CALCULATE_METHODS_OPTIONS,
  DATA_DEFAULT,
  DateOptions,
  PeriodOptions,
  goodsCalculate,
} from 'pages/StocksDetail/utils/constants';
import React, { useCallback } from 'react';
import { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import ProductModal from '../ProductModal/ProductModal';
import { useEffect } from 'react';
import { calculateOutStocks, getLastCalculateDate, getCogsSettings } from 'services/stocks-detail.service';
import moment from 'moment';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import InfoStocksSetting from './InfoStocksSetting';

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

function CalculateSettings({ disabled, setShowModal, onRefresh, stocksTypeOpts, isSetting }) {
  const methods = useFormContext();
  const { handleSubmit, reset, setValue, watch, getValues } = methods;
  const [isOpenProductModal, setIsOpenProductModal] = useState(false);
  const [disabledBtn, setDisableBtn] = useState(false);
  const [loading, setLoading] = useState(false);

  // const initForm = useCallback(() => {
  //   getLastCalculateDate().then((res) => {
  //     const _ = moment.utc(res[0]?.last_calculate_date).format('DD/MM/YYYY HH:mm:ss');
  //     methods.reset({
  //       choose_calculate_goods: 1,
  //       calculate_method: 3,
  //       calculate_according_stocks: 1,
  //       last_calculate_date: _,
  //       all_days: 1,
  //     });
  //   });
  // }, []);

  // useEffect(initForm, [initForm]);

  const loadCogsSettings = useCallback(() => {
    if (isSetting) {
      getCogsSettings().then((data) => {
        reset({
          ...getValues(),
          ...data,
          selected_product: data?.selected_product?.map((item) => ({ product_id: item })),
        });
      });
    } else {
      reset({ ...DATA_DEFAULT, last_calculate_date: watch('last_calculate_date') });
    }
  }, [isSetting]);

  useEffect(loadCogsSettings, [loadCogsSettings]);

  const handleSelectCheckbox = (field, value) => {
    methods.setValue(field, value);
    const other = goodsCalculate.find((item) => item.field !== field);
    methods.setValue(other.field, value ? 0 : 1);
    if (field == 'choose_calculate_goods') {
      setDisableBtn(false);
    } else {
      setValue('selected_product', null);
      setDisableBtn(true);
    }
  };

  const handleSelectAccordStocks = (field, value) => {
    methods.setValue(field, value);
    if (field == 'calculate_according_stocks') {
      setValue('calculate_not_according_stocks', null);
    } else if (field == 'calculate_not_according_stocks') {
      setValue('calculate_according_stocks', null);
    }

    if (field == 'all_days') {
      setValue('last_days_of_month', null);
    } else if (field == 'last_days_of_month') {
      setValue('all_days', null);
    }
  };

  return (
    <>
      <div className='bw_main_modal'>
        <div className='bw_row'>
          <div className='bw_col_4'>
            <span>Lần tính giá cuối cùng:</span>
          </div>
          <div className='bw_frm_box bw_readonly bw_col_8'>
            <FormDatePicker
              disabled={true}
              field='last_calculate_date'
              placeholder={'dd/mm/yyyy hh:mm:ss'}
              style={{ width: '100%' }}
              format='DD/MM/YYYY hh:mm:ss'
              bordered={false}
              allowClear
            />
          </div>
        </div>
        <div className='bw_row'>
          <div className='bw_col_4'>
            <span>
              Phương pháp tính <span className='bw_red'>*</span>
            </span>
          </div>
          <div className='bw_col_8'>
            <FormSelect
              field='calculate_method'
              placeholder='Chọn'
              list={mapDataOptions4SelectCustom(CALCULATE_METHODS_OPTIONS)}
              validation={{
                required: 'Phương pháp tính là bắt buộc',
              }}
            />
          </div>
        </div>
        <InfoStocksSetting stocksTypeOpts={stocksTypeOpts} />
        <div className='bw_row'>
          <label className='bw_radio bw_col_4'>
            <FormInput
              type='checkbox'
              field={`need_calculate_goods`}
              disabled={disabled}
              onChange={(ev) => handleSelectCheckbox('need_calculate_goods', ev.target.checked)}
            />
            <span />
            Hàng hóa cần tính giá
          </label>
          <label className='bw_radio bw_col_4'>
            <FormInput
              type='checkbox'
              field={`choose_calculate_goods`}
              disabled={disabled}
              onChange={(ev) => handleSelectCheckbox('choose_calculate_goods', ev.target.checked)}
            />
            <span />
            Hàng hóa được chọn
          </label>
          <button
            disabled={disabledBtn}
            onClick={() => setIsOpenProductModal(true)}
            className={`bw_btn_outline ${disabledBtn ? '' : 'bw_btn_outline_primary'}`}>
            Chọn
          </button>
        </div>
        <Spin spinning={loading}> </Spin>
        <div className='bw_row'>
          <FormItem disabled={disabled} label='Thời gian' isRequired className='bw_col_2'>
            <FormSelect
              field={'calculate_date_settings'}
              list={DateOptions}
              onChange={(value) => {
                methods.setValue('calculate_date_settings', value);
                const selectedItem = DateOptions.find((_) => _.value === value);
                if (selectedItem) {
                  methods.setValue('start_date_settings', selectedItem.from_date);
                  methods.setValue('end_date_settings', selectedItem.to_date);
                  methods.setValue('period_settings', selectedItem.period);
                }
              }}
              // validation={{
              //   required: 'Thời gian là bắt buộc',
              // }}
            ></FormSelect>
          </FormItem>
          <FormItem disabled={disabled} label='Từ ngày' isRequired className='bw_col_4'>
            <FormDateRange
              allowClear={true}
              fieldStart={'start_date_settings'}
              fieldEnd={'end_date_settings'}
              placeholder={['Từ ngày', 'Đến ngày']}
              format={'DD/MM/YYYY'}
            />
          </FormItem>
        </div>
        <div className='bw_row'>
          <FormItem disabled={true} label='Kỳ tính giá' className='bw_col_2'>
            <FormSelect
              disabled={true}
              field={'period_settings'}
              list={PeriodOptions}
              // validation={{
              //   required: 'Kỳ tính giá là bắt buộc',
              // }}
            ></FormSelect>
          </FormItem>

          <label className='bw_radio bw_col_3'>
            <FormInput
              type='checkbox'
              field={`calculate_according_stocks`}
              disabled={disabled}
              onChange={(ev) => handleSelectAccordStocks('calculate_according_stocks', ev.target.checked)}
            />
            <span />
            Tính giá theo kho
          </label>
          {/* <label className='bw_radio bw_col_3'>
            <FormInput
              type='checkbox'
              field={`calculate_not_according_stocks`}
              disabled={disabled}
              onChange={(ev) => handleSelectAccordStocks('calculate_not_according_stocks', ev.target.checked)}
            />
            <span />
            Tính giá không theo kho
          </label> */}
        </div>

        <div className='bw_row'>
          <FormItem label='Thời gian tự động tính' className='bw_col_2' disabled={disabled}>
            <FormDatePicker
              field='time_calculating'
              placeholder={'--:--'}
              // style={{
              //   width: '100%',
              // }}
              format='HH:mm'
              bordered={false}
              allowClear
              picker={'time'}
            />
          </FormItem>

          <label className='bw_radio bw_col_3'>
            <FormInput
              type='checkbox'
              field={`all_days`}
              disabled={disabled}
              onChange={(ev) => handleSelectAccordStocks('all_days', ev.target.checked)}
            />
            <span />
            Hằng ngày
          </label>
          <label className='bw_radio bw_col_3'>
            <FormInput
              type='checkbox'
              field={`last_days_of_month`}
              disabled={disabled}
              onChange={(ev) => handleSelectAccordStocks('last_days_of_month', ev.target.checked)}
            />
            <span />
            Ngày cuối tháng
          </label>
        </div>

        <div className='bw_row'>
          <div className='bw_col_12'>
            <div className='bw_frm_box'>
              <b className='bw_red'>
                Trong khi tính giá, bạn không nên thêm/sửa hàng hóa, các chứng từ liên quan đến hàng hóa phát sinh trong
                khoảng thời gian tính giá
              </b>
            </div>
          </div>
        </div>
      </div>
      {isOpenProductModal && <ProductModal setIsOpenModal={setIsOpenProductModal} />}
    </>
  );
}

export default CalculateSettings;
