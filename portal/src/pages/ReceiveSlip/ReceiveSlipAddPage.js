import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { showToast } from 'utils/helpers';
import moment from 'moment';
import { PAYMENTSTATUS, RECEIPTSOBJECT, ToastStyle } from './utils/constants';

import { useDispatch } from 'react-redux';
import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';

import Information from './components/Information';
import InformationDetail from './components/InformationDetail';
import { create, getCode, getDetail, getOrder, update } from './actions/index';
import Orders from './components/Orders';
import Documents from './components/Documents';
import ReceiptsObject from './components/ReceiptsObject';
import queryString from 'query-string';

const ReceiveSlipAddPage = () => {
  const dispatch = useDispatch();
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const { pathname, search } = useLocation();
  const { receive_slip_id } = useParams();
  const [loadingDetail, setLoadingDetail] = useState(false);
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const { receiveSlipData, receiveSlipCode, detailOrder } = useSelector((state) => state.receiveSlip);
  const { order_id, type } = queryString.parse(search);

  const loadReceiveSlipDetal = useCallback(() => {
    if (receive_slip_id) {
      setLoadingDetail(true);
      dispatch(getDetail(receive_slip_id));
      setLoadingDetail(false);
    } else {
      dispatch(getCode());
      if (order_id && type) {
        dispatch(getOrder({ order_id, type }));
      }
      methods.reset({
        is_active: 1,
        payment_status: PAYMENTSTATUS.PAID,
        payment_date: moment(new Date(), 'DD/MM/yyyy').format('DD/MM/yyyy'),
      });
    }
  }, [dispatch, receive_slip_id]);

  useEffect(loadReceiveSlipDetal, [loadReceiveSlipDetal]);

  useEffect(() => {
    if (receive_slip_id && receiveSlipData) {
      methods.reset({
        ...receiveSlipData,
      });
    }
  }, [receive_slip_id, receiveSlipData]);

  useEffect(() => {
    if (receiveSlipCode && !receive_slip_id) {
      methods.setValue('receive_slip_code', receiveSlipCode.trim());
    }
  }, [receiveSlipCode]);

  useEffect(() => {
    if (order_id && type) {
      // thêm thông tin cho phiếu thu
      methods.reset({
        ...detailOrder,
        order_list: [detailOrder],
        is_active: 1,
        payment_status: PAYMENTSTATUS.PAID,
        payment_date: moment(new Date(), 'DD/MM/yyyy').format('DD/MM/yyyy'),
        receiver_type: detailOrder?.detailOrder || 3,
        receive_slip_code: receiveSlipCode?.trim(),
        is_review: 1,
      });
    }
  }, [order_id, type, detailOrder]);

  // console.log(methods.watch());
  // console.log(methods.formState.errors);

  const onSubmit = (payload) => {
    try {
      if (receive_slip_id) {
        dispatch(update(receive_slip_id, payload));
      } else {
        dispatch(create(payload));
        methods.reset({
          is_active: 1,
          payment_status: PAYMENTSTATUS.PAID,
          payment_date: moment(new Date(), 'DD/MM/yyyy').format('DD/MM/yyyy'),
          receive_slip_code: receiveSlipCode.trim(),
        });
      }
    } catch (error) {
      showToast.error(error?.message, ToastStyle);
    }
  };

  const detailForm = [
    {
      id: 'information',
      title: 'Thông tin chứng từ',
      component: Information,
      fieldActive: ['receive_slip_code', 'payment_date'],
    },
    {
      id: 'information_detail',
      title: 'Thông tin phiếu thu',
      component: InformationDetail,
      fieldActive: [
        'company_id',
        'business_id',
        'receive_type_id',
        'cashier_id',
        'payment_type',
        'total_money',
        'payment_status',
      ],
    },
    {
      id: 'receipt_object',
      title: 'Đối tượng thu',
      component: ReceiptsObject,
      fieldActive: ['receiver_type', 'receiver_id'],
      disabled: order_id ? true : disabled,
    },
    {
      id: 'orders',
      title: 'Thông tin đơn hàng',
      component: Orders,
      fieldActive: ['order_list'],
      hidden: methods.watch('receiver_type') === RECEIPTSOBJECT.CUSTOMER ? false : true,
    },
    {
      id: 'document',
      title: 'Chứng từ/ Hóa đơn',
      fieldActive: ['receive_slip_files'],
      component: Documents,
      onRefesh: loadReceiveSlipDetal,
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection loading={loadingDetail} detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default ReceiveSlipAddPage;
