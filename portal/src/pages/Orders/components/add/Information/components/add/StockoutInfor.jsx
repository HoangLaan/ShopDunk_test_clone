import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import moment from 'moment';

import { orderAddressOpts, paymentFormType } from 'pages/Orders/helpers/constans';
import { getListStoreBySale, getListStoreByUser } from 'pages/Orders/helpers/call-api';
import { getListByStore } from 'services/payment-form.service';
import { resetProductList } from 'pages/Orders/helpers/utils';
import { useAuth } from 'context/AuthProvider';
import { showToast } from 'utils/helpers';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';

const StockoutInfor = ({ id, title, disabled, userSchedule }) => {
  const { watch, clearErrors, setValue } = useFormContext();
  const [storeOpts, setStoreOpts] = useState([]);
  const [saleOpts, setSaleOpts] = useState([]);
  const store_id = watch('store_id');
  const order_id = watch('order_id');

  const { user } = useAuth();

  const handleChangeStore = useCallback(
    (store_id) => {

      setValue('store_id', store_id);

      // Lấy store trong mảng
      let findStore = storeOpts.find((_store) => _store.value === store_id);

      // lưu giá trị business tìm dc
      setValue('business_id', findStore?.business_id);
      setValue('business_name', findStore?.business_name);
      setValue('store_address', findStore?.address);
      setValue('store_name', findStore?.store_name);
      setValue('store_id', findStore?.store_id);

      resetProductList(watch, setValue);

      clearErrors('store_id');

      // if (
      //   store_id &&
      //   !user?.isAdministrator &&
      //   (!userSchedule || userSchedule?.every((schedule) => schedule.store_id != store_id))
      // ) {
      //   showToast.warning('Bạn không có ca làm việc ở cửa hàng này ngày hôm nay !');
      // }
    },
    [storeOpts, setValue, watch, clearErrors, user?.isAdministrator, userSchedule],
  );

  const handleChangeSale = useCallback((salesassistant) => {

    setValue('salesassistant', salesassistant)
  }, [setValue])

  useEffect(() => {
    if (store_id && !order_id) {
      getListByStore(store_id).then((res) => {
        let flag = false;
        setValue(
          'data_payment',
          res // tạm thời ẩn hình thức thanh toán bên thứ 3
            // .filter((item) => item.payment_type === paymentFormType.BANK || item.payment_type === paymentFormType.CASH)
            .map((item) => {
              const is_checked = !flag && item.payment_type === paymentFormType.CASH;
              if (item.payment_type === paymentFormType.CASH) {
                flag = true;
              }

              return {
                ...item,
                payment_value: 0,
                is_checked,
              };
            }),
        );
      });
    }
  }, [store_id, order_id, setValue]);

  // Lấy danh sách cửa hàng chuyển
  const fetchStoreOpts = useCallback(
    (value, isFirst = false) => {
      return getListStoreByUser({
        search: value,
        is_active: 1,
        itemsPerPage: isFirst ? 9999 : 30,
        page: 1,
      }).then((body) => {
        const _storeOpts = body.items.map((_store) => ({
          label: _store.store_name,
          value: _store.store_id,
          ..._store,
        }));

        setStoreOpts(_storeOpts);

        if (isFirst && _storeOpts.length === 1) {
          setValue('store_id', _storeOpts[0]?.store_id);
          setValue('business_id', _storeOpts[0]?.business_id);
          setValue('business_name', _storeOpts[0]?.business_name);
          setValue('store_address', _storeOpts[0]?.address);
          setValue('store_name', _storeOpts[0]?.store_name);
        }
      });
    },
    [setValue],
  );

  // useEffect(() => {
  //   if (storeOpts.length > 0 && store_id) {
  //     if (user?.isAdministrator === 1) return;

  //     if (!storeOpts.find((item) => item.store_id === store_id)) {
  //       showToast.error('Bạn không được phân cửa hàng của hóa đơn này');
  //       window._$g.rdr(`/orders`);
  //     }
  //   }
  // }, [storeOpts, user?.isAdministrator, store_id]);

  useEffect(() => {
    fetchStoreOpts(null, true);
  }, [fetchStoreOpts]);

  const fetchSaleOpts = useCallback(
    (value) => {
      return getListStoreBySale({
        search: value,
        store_id: watch('store_id')
      }).then((body) => {
        const _saleOpts = body?.map((_sale) => ({
          label: `${_sale.user_name} - ${_sale.full_name}`,
          value: _sale.user_name,
          ..._sale
        }))

        setSaleOpts(_saleOpts);
      });
    },
    [setValue]
  )

  useEffect(() => {
    fetchSaleOpts()
  }, [fetchSaleOpts])

  return (
    <BWAccordion title={title} id={id} isRequired>
      <div className='bw_row'>
        {/* <FormItem label='Miền' className='bw_col_4' disabled isRequired>
          <FormInput type='text' field='business_name' disabled />
        </FormItem> */}
        <FormItem label='Cửa hàng' className='bw_col_4' disabled={disabled} isRequired>
          <FormDebouneSelect
            field='store_id'
            id='store_id'
            options={storeOpts}
            style={{ width: '100%' }}
            fetchOptions={fetchStoreOpts}
            debounceTimeout={700}
            placeholder={'-- Chọn --'}
            validation={{
              required: 'Cửa hàng xuất hàng là bắt buộc',
            }}
            onChange={(e) => {
              handleChangeStore(e?.value);
            }}
          />
        </FormItem>
        <FormItem label='Nhân viên bán hàng' className='bw_col_4' disabled={disabled || !watch('store_id')} isRequired>
          <FormDebouneSelect
            field='salesassistant'
            id='salesassistant'
            options={saleOpts}
            style={{ width: '100%' }}
            fetchOptions={fetchSaleOpts}
            debounceTimeout={700}
            placeholder={'-- Chọn --'}
            validation={{
              required: 'Nhân viên bán hàng là bắt buộc',
            }}
            onChange={(e) => {
              handleChangeSale(e?.value);
            }}
          />
        </FormItem>
        <FormItem label='Địa điểm nhận hàng' className='bw_col_4' disabled={disabled} isRequired>
          <FormSelect field='is_delivery_type' list={orderAddressOpts} />
        </FormItem>
        <FormItem disabled={disabled} isRequired label='Ngày nhận hàng dự kiến' className='bw_col_4'>
          <FormDatePicker
            style={{
              width: '100%',
              padding: '2px 0px',
            }}
            placeholder='DD/MM/YYYY'
            bordered={false}
            field='receiving_date'
            format='DD/MM/YYYY'
            validation={{
              required: 'Ngày nhận hàng là bắt buộc',
            }}
            disabledDate={(current) => {
              return moment().add(-1, 'days') >= current || moment().add(1, 'month') <= current;
            }}
          />
        </FormItem>
        <FormItem label='Địa chỉ cửa hàng' className='bw_col_8' disabled isRequired>
          <FormInput type='text' field='store_address' disabled />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default StockoutInfor;
