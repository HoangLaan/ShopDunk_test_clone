import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';

import { getErrorMessage } from 'utils/index';
import { read } from 'pages/Orders/helpers/call-api';
import { orderType, paymentStatus } from 'pages/Orders/helpers/constans';

//components
import FormSection from 'components/shared/FormSection';
import PayingDetail from 'pages/Orders/components/payment/PayingDetail';
import Products from 'pages/Orders/components/payment/Products';
import CustomerInfor from 'pages/Orders/components/payment/CustomerInfor';
import OrderInfor from 'pages/Orders/components/payment/OrderInfor';
import Gifts from 'pages/Orders/components/payment/Gifts';
import BusinessInfo from '../components/add/Information/components/add/BusinessInfo';

const OrdersPayment = () => {
  const methods = useForm();
  const { reset, watch } = methods;
  const { order_id } = useParams();
  const disabled = true;
  const [loading, setLoading] = useState(false);
  const gifts = watch('gifts');

  const loadOrderDetail = useCallback(() => {
    if (order_id) {
      setLoading(true);

      read(order_id)
        .then((res) => {
          // nếu là đơn trả góp và chưa đồng ý điều khoản thì đưa về trang chỉnh sửa đơn hàng
          if (
            (+res.order_type === orderType.INSTALLMENT_OFFLINE || +res.order_type === orderType.INSTALLMENT_ONLINE) &&
            !res.is_agree_policy
          ) {
            showToast.warning(
              getErrorMessage({
                message: 'Cần phải đồng ý với điều khoản trước khi thanh toán.',
              }),
            );
            window._$g.rdr(`/orders/edit/${order_id}`);
          }

          reset({
            ...res,
            promotion_offers: res?.promotion_apply?.reduce((acc, curr) => {
              return acc.concat(curr?.offers);
            }, []),
            data_payment: res?.data_payment
              ?.filter((item) => item?.is_checked)
              ?.map((item) => ({ ...item, payment_value: 0 })),
          });
        })
        .catch((error) => {
          showToast.error(
            getErrorMessage({
              message: error?.message || 'Đã xảy ra lỗi vui lòng kiểm tra lại.',
            }),
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [order_id, reset]);

  useEffect(loadOrderDetail, [loadOrderDetail]);

  useEffect(() => {
    document.getElementById('PayingDetail').scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }, []);

  const isOrderFromStocksTransfer = watch('order_type') === 11;
  const detailForm = [
    {
      title: 'Thông tin đơn hàng',
      id: 'OrderInfor',
      component: OrderInfor,
    },
    {
      title: 'Thông tin khách hàng',
      id: 'CustomerInfor',
      component: isOrderFromStocksTransfer ? BusinessInfo : CustomerInfor,
      nameInstanceBusiness: 'business_receive',
      fieldActive: isOrderFromStocksTransfer ? ['business_name'] : ['customer', 'phone_number'],
    },
    {
      title: 'Thông tin sản phẩm',
      id: 'Products',
      component: Products,
    },
    {
      title: 'Thông tin quà tặng',
      id: 'Products',
      component: Gifts,
      hidden: gifts?.length === 0,
    },
    {
      title: 'Thông tin thanh toán',
      id: 'PayingDetail',
      component: PayingDetail,
      setLoading: setLoading,
      loadOrderDetail: loadOrderDetail,
    },
  ];

  const isHiddenDetailBtn = +watch('payment_status') !== paymentStatus.PAID;

  const actions = [
    {
      type: 'success',
      outline: true,
      content: 'Chi tiết đơn hàng',
      onClick: () => window._$g.rdr(`/orders/detail/${watch('order_id')}`),
      hidden: isHiddenDetailBtn,
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} disabled={disabled} loading={loading} actions={actions} />
    </FormProvider>
  );
};

export default OrdersPayment;
