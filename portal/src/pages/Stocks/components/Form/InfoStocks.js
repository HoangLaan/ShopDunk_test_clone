/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { notification } from 'antd';
import { useFormContext } from 'react-hook-form';
import { getListStocksTypeOptions, getListStoreOptionsByParam } from '../../helpers/call-api';
import FormEditor from 'components/shared/BWFormControl/FormEditor';

import { getOptionsGlobal } from 'actions/global';

const InfoStocks = ({ disabled, title, id }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const { watch, setValue, clearErrors } = methods;

  const [update, setUpdate] = useState(false);
  const [storeOpts, setStoreOpts] = useState([]);
  const [stocksTypeOpts, setStocksTypeOpts] = useState([]);
  const [selectStocksType, setSelectStocksType] = useState({});
  const [selectStore, setSelectStore] = useState({});

  const { areaData, companyData, businessData } = useSelector((state) => state.global);

  useEffect(() => {
    dispatch(getOptionsGlobal('area'));
    dispatch(getOptionsGlobal('company'));
  }, []);

  useEffect(() => {
    dispatch(
      getOptionsGlobal('business', {
        company_id: methods.watch('company_id'),
      }),
    );
  }, [methods.watch('company_id')]);

  const getDataStore = async () => {
    try {
      let dataStocksTypeOpts = await getListStocksTypeOptions();
      dataStocksTypeOpts = dataStocksTypeOpts.map(({ stocks_type_id, stocks_type_name, ...x }) => ({
        value: stocks_type_id,
        label: stocks_type_name,
        ...x,
      }));
      setStocksTypeOpts(dataStocksTypeOpts);
      const params = {
        company_id: methods.watch('company_id'),
        area_id: methods.watch('area_id'),
        business_id: methods.watch('business_id'),
      };
      let dataStoreOpts = await getListStoreOptionsByParam(params);
      dataStoreOpts = dataStoreOpts.map(({ store_id, store_name, store_code, ...x }) => ({
        value: store_id,
        label: store_name,
        store_code,
        ...x,
      }));
      setStoreOpts(dataStoreOpts);
    } catch (error) {
      notification.error({ message: `Có lỗi xảy ra.` });
    }
  };

  useEffect(() => {
    getDataStore();
  }, [methods.watch('business_id'), methods.watch('area_id')]);

  const handleOnChangeStocksType = (value) => {
    clearErrors();

    setUpdate(true);
    setSelectStocksType(value);
    setSelectStore({});

    setValue('stocks_type_id', value.value);
    setValue('type', value?.type);
    setValue('stocks_code', null);
    setValue('store_id', null);
  };

  useEffect(() => {
    if (watch('stocks_type_id') && (watch('store_id') || watch('type') == 9) && update === true) {
      let stocks_type_code =
        selectStocksType && selectStocksType.stocks_type_code
          ? selectStocksType.stocks_type_code
          : watch('stocks_type_code');
      let store_code = (selectStore && selectStore?.store_code ? selectStore.store_code : watch('store_code')) || '';
      let stocks_code = `${stocks_type_code}${store_code}`;
      setValue('stocks_code', stocks_code || '');
    }
  }, [watch('stocks_type_id'), watch('store_id')]);

  const handleChangeCompanyBusiness = (value, check) => {
    if (check) {
      setValue('business_id', value);
      setValue('store_id', null);
    } else {
      setValue('company_id', value);
      setValue('business_id', null);
      setValue('store_id', null);
    }
  };

  return (
    <BWAccordion title={title} id={id} isRequired>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Mã kho hàng'>
            <FormInput id='stocks_code' type='text' field='stocks_code' disabled={disabled || watch('type') != 9} />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Loại kho hàng' isRequired>
            <FormSelect
              id='stocks_type_id'
              type='text'
              field='stocks_type_id'
              validation={{
                required: 'Loại kho hàng là bắt buộc',
              }}
              disabled={disabled}
              list={stocksTypeOpts}
              onChange={(e, o) => handleOnChangeStocksType(o)}
            />
          </FormItem>
        </div>
      </div>

      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Tên kho' isRequired>
            <FormInput
              type='text'
              field='stocks_name'
              placeholder='Nhập tên kho'
              validation={{
                required: 'Tên kho là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Công ty' isRequired={true}>
            <FormSelect
              disabled={disabled}
              field='company_id'
              list={mapDataOptions4SelectCustom(companyData)}
              onChange={(e, o) => {
                handleChangeCompanyBusiness(o.value || null);
              }}
              validation={{
                required: 'Công ty là bắt buộc',
              }}
            />
          </FormItem>
        </div>
      </div>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Khu vực' isRequired={true}>
            <FormSelect
              field='area_id'
              list={mapDataOptions4Select(areaData)}
              validation={{
                required: 'Khu vực là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem disabled={disabled || !methods.watch('company_id')} label='Miền' isRequired={true}>
            <FormSelect
              disabled={disabled || !methods.watch('company_id')}
              field='business_id'
              list={mapDataOptions4Select(businessData)}
              onChange={(e, o) => {
                handleChangeCompanyBusiness(o.value || null, true);
              }}
              validation={{
                required: 'Miền công ty là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        {watch('type') == 9 ? (
          <>
            <div className='bw_col_6'></div>
            <div className='bw_col_6 bw_mb_1'>
              <span style={{ fontWeight: 'bold', color: 'red' }}>( Kho công ty , không thuộc cửa hàng )</span>
            </div>
          </>
        ) : null}

        {watch('type') == 9 ? null : (
          <div className='bw_col_6'>
            <FormItem disabled={disabled || !methods.watch('business_id')} label='Thuộc cửa hàng' isRequired>
              <FormSelect
                id='store_id'
                type='text'
                field='store_id'
                validation={{
                  validate: {
                    required: (_, formValues) => {
                      if (formValues.type != 9 && !formValues.store_id) {
                        return 'Cửa hàng là bắt buộc';
                      }
                    },
                  },
                }}
                list={storeOpts}
                disabled={disabled}
                onChange={(e, objStore) => {
                  setValue('store_id', objStore.value || null);
                  setSelectStore(objStore);
                }}
              />
            </FormItem>
          </div>
        )}
      </div>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Số điện thoại' isRequired>
            <FormInput
              type='text'
              field='phone_number'
              placeholder='Nhập số điện thoại'
              validation={{
                required: 'Số điện thoại là bắt buộc',
                pattern: {
                  value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                  message: 'Số điện thoại không hợp lệ.',
                },
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Email'>
            <FormInput
              type='text'
              field='email'
              placeholder='Nhập email'
              validation={{
                pattern: {
                  value: /[^\s@]+@[^\s@]+\.[^\s@]+/gi,
                  message: 'Email không hợp lệ.',
                },
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả'>
            <FormEditor field='description' disabled={disabled} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default InfoStocks;
