import React, { useCallback, useEffect } from 'react';
import PaymentType from './components/PaymentType';
import Other from './components/Other';
import { useFormContext } from 'react-hook-form';
import FormSection from 'components/shared/FormSection';
import { getConfigValue } from 'services/app-config.service';
import { notification } from 'antd';
import { toString } from 'lodash';
import { mapDataOptions4Select } from 'utils/helpers';
import { getPaymentFormOptions } from 'services/payment-form.service';
import { getReceiveTypeOptions } from 'services/receive-type.service';
import { getOptionsOrderType } from 'services/commission.service';
import { getCustomerTypeOptions } from 'services/return-policy.service';

const OrderConfig = () => {
  const methods = useFormContext();
  const { setValue } = methods;

  const customToString = (data) => {
    data = mapDataOptions4Select(data);
    data.forEach((item) => {
      item.id = toString(item.id || item.value || item.order_type_id);
      item.name = item.name || item.order_type_name;
    });
    return data;
  };

  const getOptions = useCallback(() => {
    getPaymentFormOptions().then((data)=>{
      setValue('payment_form_option', customToString(data));
    });
    getReceiveTypeOptions().then((data)=>{
      setValue('receive_type_option', customToString(data));
    });
    getOptionsOrderType().then((data)=>{
      setValue('order_type_option', customToString(data.items));
    });
    getCustomerTypeOptions().then((data)=>{
      setValue('customer_type_option', customToString(data.items));
    });
  }, [])

  const getDetail = useCallback(() => {
    try {
      const keys = [
        'PAYMENT_POLICY',
        'RESTORE_IMEI_FREQ',
        'PAYMENTFORM_POS_VTB',
        'PAYMENTFORM_POS_VNPAY',
        'PAYMENTFORM_POS_VCB',
        'PAYMENTFORM_PARTNER_SHOPEEPAY',
        'PAYMENTFORM_PARTNER_ONEPAY',
        'PAYMENTFORM_PARTNER_MOMO',
        'PAYMENTFORM_PARTNER_VNPAY',
        'PAYMENTFORM_PARTNER_ZALOPAY',
        'SL_ORDER_RECEIVETYPE',
        'ORDER_TYPE_LAZADA',
        'ORDER_TYPE_SHOPEE',
        'CUSTOMER_TYPE_LAZADA',
        'CUSTOMER_TYPE_SHOPEE'
      ];
      keys.forEach((key) => {
        getConfigValue({ key_config: key }).then((data) => {
          setValue(key, toString(data[0].value_config));
        });
      });
    } catch (error) {
      notification.error({ message: window._$g._(error.message) });
    }
  }, []);
  
  useEffect(getDetail, [getDetail]);
  useEffect(getOptions, [getOptions]);
  const detailForm = [
    {
      title: 'Cài đặt hình thức thanh toán',
      id: 'PaymentTypeConfig',
      component: PaymentType,
    },
    {
      title: 'Cài đặt khác',
      id: 'OtherConfig',
      component: Other,
    },
  ];
  return <FormSection detailForm={detailForm} />;
};

export default OrderConfig;
