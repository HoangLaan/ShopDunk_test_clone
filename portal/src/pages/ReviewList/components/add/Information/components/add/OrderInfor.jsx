import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import moment from 'moment';

import { INSTALLMENT_TYPE } from 'pages/ReviewList/helpers/constans';
import { CareServiceOpts } from 'pages/ReviewList/helpers/constans';
import { getListOrderStatus } from 'services/order-status.service';
import { resetProductList } from 'pages/ReviewList/helpers/utils';
import { showToast } from 'utils/helpers';
import { useAuth } from 'context/AuthProvider';

import { paymentFormType } from 'pages/ReviewList/helpers/constans';
import { getListStoreByUser } from 'pages/ReviewList/helpers/call-api';
import { getListByStore } from 'services/payment-form.service';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
//components

const Information = ({ disabled, ReviewId, userSchedule, isOrderFromStocksTransfer }) => {
  const methods = useFormContext({});
  const { watch, setValue, clearErrors } = methods;
  const [orderTypeOpts, setOrderTypeOpts] = useState([]);
  const [orderStatusOpts, setOrderStatusOpts] = useState([]);
  const [isFirstGetStatus, setIsFirstGetStatus] = useState(true);

  const [storeOpts, setStoreOpts] = useState([]);
  const store_id = watch('store_id');
  const order_id = watch('order_id');

  const order_type_id = watch('order_type_id');
  const { user } = useAuth();

  useEffect(() => {
    if (orderTypeOpts.length > 0 && order_type_id) {
      if (user?.isAdministrator === 1) return;
      if (!orderTypeOpts.find((item) => item.order_type_id === order_type_id)) {
        showToast.error('Bạn không có quyền loại đơn hàng của hóa đơn này');
        window._$g.rdr(`/orders`);
      }
    }
  }, [orderTypeOpts, order_type_id, user?.isAdministrator]);

  useEffect(() => {
    if (userSchedule && userSchedule.length > 0) {
      const offlineOrderType = orderTypeOpts?.find((order) => order.type === 1);

      if (offlineOrderType && !ReviewId && !watch('order_type_id')) {
        setValue('order_type_id', offlineOrderType?.value);
        setValue('order_type', offlineOrderType?.type);
      }
    }
  }, [orderTypeOpts, userSchedule, ReviewId, setValue, watch('order_type_id')]);

  // Lấy danh sách trạng thái đơn hàng
  const fetchOrderStatus = useCallback(
    (value, isChangeOrderType = false) => {
      const order_type_id = watch('order_type_id');

      return getListOrderStatus({
        search: value,
        is_active: 1,
        order_type_id: order_type_id,
      }).then((body) => {
        const _orderStatusOpts = body.items.map((_res) => ({
          label: _res.order_status_name,
          value: _res.order_status_id,
          ..._res,
        }));

        if (order_type_id) {
          // Mặc định lấy trạng thái đơn là mới nhất
          const statusNews = _orderStatusOpts.filter((_st) => _st?.is_new_order);

          if (isChangeOrderType && statusNews?.length > 0) {
            if (statusNews.length === 1) {
              setValue('order_status_id', statusNews[0]?.value);
              clearErrors('order_status_id');
            } else if (watch('installment_type') === INSTALLMENT_TYPE.COMPANY) {
              const waitConfirmStatus = statusNews.find((status) => status.label.toLowerCase()?.includes('duyệt'));

              if (waitConfirmStatus) {
                setValue('order_status_id', waitConfirmStatus?.value);
                clearErrors('order_status_id');
              }
            } else {
              const firstNewStatus = statusNews.find((status) => status.label.toLowerCase()?.includes('hàng mới'));
              if (firstNewStatus) {
                setValue('order_status_id', firstNewStatus?.value);
                clearErrors('order_status_id');
              } else {
                setValue('order_status_id', statusNews[0]?.value);
                clearErrors('order_status_id');
              }
            }
          }
        }
        //set danh sách trạng thái đơn hàng
        setOrderStatusOpts(_orderStatusOpts);
      });
    },
    [watch, setValue, clearErrors, watch('installment_type')],
  );

  //news
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

      resetProductList(watch, setValue);

      clearErrors('store_id');

      if (
        store_id &&
        !user?.isAdministrator &&
        (!userSchedule || userSchedule?.every((schedule) => schedule.store_id != store_id))
      ) {
        showToast.warning('Bạn không có ca làm việc ở cửa hàng này ngày hôm nay !');
      }
    },
    [storeOpts, setValue, watch, clearErrors, user?.isAdministrator, userSchedule],
  );

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
  // const fetchStoreOpts = useCallback(
  //   (value, isFirst = false) => {
  //     return getListStoreByUser({
  //       search: value,
  //       is_active: 1,
  //       itemsPerPage: isFirst ? 9999 : 30,
  //       page: 1,
  //     }).then((body) => {
  //       const _storeOpts = body.items.map((_store) => ({
  //         label: _store.store_name,
  //         value: _store.store_id,
  //         ..._store,
  //       }));

  //       setStoreOpts(_storeOpts);

  //       if (isFirst && _storeOpts.length === 1) {
  //         setValue('store_id', _storeOpts[0]?.store_id);
  //         setValue('business_id', _storeOpts[0]?.business_id);
  //         setValue('business_name', _storeOpts[0]?.business_name);
  //         setValue('store_address', _storeOpts[0]?.address);
  //         setValue('store_name', _storeOpts[0]?.store_name);
  //       }
  //     });
  //   },
  //   [setValue],
  // );

  // useEffect(() => {
  //   fetchStoreOpts(null, true);
  // }, [fetchStoreOpts]);

  useEffect(() => {
    if (order_type_id && isFirstGetStatus) {
      fetchOrderStatus(null, ReviewId ? false : true);
      setIsFirstGetStatus(false);
    }
  }, [order_type_id, isFirstGetStatus, fetchOrderStatus, ReviewId]);

  // load default installment status
  useEffect(() => {
    if (!ReviewId && watch('installment_type')) {
      fetchOrderStatus(null, ReviewId ? false : true);
    }
  }, [ReviewId, fetchOrderStatus, watch]);
  const handleDetailsOrder = () => {
    window._$g.rdr(`/orders/detail/${ReviewId}`);
  };
  const handleDetailsBooking = () => {
    window._$g.rdr(`/Booking/detail/${ReviewId}`);
  };
  return (
    <BWAccordion title='Thông tin chung' id='bw_info_cus' isRequired={isOrderFromStocksTransfer ? false : true}>
      <div className='bw_row'>
        <FormItem label='Tên khách hàng' className='bw_col_6'>
          <FormInput type='text' field='FULLNAME' placeholder='' />
        </FormItem>
        <FormItem label='Số điện thoại' className='bw_col_6'>
          <FormInput type='text' field='PHONENUMBER' placeholder='' />
        </FormItem>
        <FormItem label='Dịch vụ sử dụng' className='bw_col_6' isRequired>
          <FormInput type='text' field='CARESERVICENAME' placeholder='' />
        </FormItem>

        <FormItem label='Mã đặt hẹn' className='bw_col_6' disabled={false}>
          <FormInput field='APPOINTMENTSCHEDULENO' onClick={handleDetailsBooking} />
        </FormItem>
        {/* <FormItem label='Mã đơn hàng' className='bw_col_6' disabled={false}>
          <FormInput field='APPOINTMENTSCHEDULENO' onClick={handleDetailsOrder} />
        </FormItem> */}
      </div>
    </BWAccordion>
  );
};

export default Information;
