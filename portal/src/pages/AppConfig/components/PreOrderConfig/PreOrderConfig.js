import React, { useCallback } from 'react';
import FormSection from 'components/shared/FormSection';
import { useFormContext } from 'react-hook-form';
import PaymentType from './components/PaymentType';
import Status from './components/Status';
import Other from './components/Other';
import { getConfigValue } from 'services/app-config.service';
import { useEffect } from 'react';
import { notification } from 'antd';
import { mapDataOptions4Select } from 'utils/helpers';
import { getOrderStatusOptions } from 'services/order-status.service';
import { toString } from 'lodash';
import { getCouponOptions } from 'services/coupon.service';

const PreOrderConfig = () => {
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
    getOrderStatusOptions().then((data)=>{
      setValue('order_status_option', customToString(data));
    });
    getCouponOptions().then((data)=>{
      setValue('coupon_option', customToString(data));
    });
  }, [])

  const getDetail = useCallback(() => {
    try {
      const keys = [
        'PREOD_URL',
        'PREOD_DOMAIN',
        'CDN',
        'PREOD_DEPOSIT',
        'PREOD_GIFTID',
        'PREOD_PAYMENTFORM_VTB',
        'PREOD_PAYMENTFORM_ZALO',
        'PREOD_PAYMENTFORM_PAY',
        'PREOD_PAYMENTFORM_VN',
        'PREOD_PAYMENTFORM_ONE',
        'PREOD_PAYMENTFORM_CASH',
        'PREOD_ODSTATUS_DEPOSITED',
        'PREOD_ODSTATUS_NEDEPOSIT',
        'PREOD_ODSTATUS_PAID',
        'PREOD_ODSTATUS_ORDERED',
        'PREOD_ODSTATUS_NEW',
        'PREOD_ODSTATUS_COMPLETE',
        'PREOD_ODSTATUS_GOING',
        'PREOD_ODSTATUS_ALREADY',
        'PREOD_ODSTATUS_RETURNING',
        'LDP_PREORDER',
        'AUTOCODE_COUPONID'
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
      title: 'Cài đặt hình thức thanh toán PreOrder',
      id: 'preOrderPaymentTypeConfig',
      component: PaymentType,
    },
    {
      title: 'Cài đặt trạng thái đơn hàng pre-order',
      id: 'preOrderStatusConfig',
      component: Status,
    },
    {
      title: 'Cài đặt khác',
      id: 'preOrderOtherConfig',
      component: Other,
    },
  ];
  return <FormSection detailForm={detailForm} />;
};

export default PreOrderConfig;
