import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

import { INSTALLMENT_TYPE, statusPaymentOpts } from 'pages/Orders/helpers/constans';
import { getOrderType } from 'pages/Orders/helpers/call-api';
import { getListOrderStatus } from 'services/order-status.service';
import { resetProductList } from 'pages/Orders/helpers/utils';
import { showToast } from 'utils/helpers';
import { useAuth } from 'context/AuthProvider';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

const Information = ({ disabled, orderId, userSchedule, isOrderFromStocksTransfer }) => {
  const methods = useFormContext({});
  const { watch, setValue, clearErrors } = methods;
  const [orderTypeOpts, setOrderTypeOpts] = useState([]);
  const [orderStatusOpts, setOrderStatusOpts] = useState([]);
  const [isFirstGetStatus, setIsFirstGetStatus] = useState(true);

  const order_type_id = watch('order_type_id');
  const { user } = useAuth();

  const isAdd = !Boolean(orderId) && !disabled;
  const isEdit = Boolean(orderId) && !disabled;
  const isView = Boolean(orderId) && disabled;

  // Lấy danh sách loại đơn hàng
  const fetchOrderType = async (value) => {
    ///'services/store.service'
    return getOrderType({
      search: value,
      action: isAdd ? 'add' : isEdit ? 'edit' : isView ? 'view' : '',
    }).then((body) => {
      const _orderTypeOpts = body.map((_res) => ({
        label: _res.order_type_name,
        value: _res.order_type_id,
        ..._res,
      }));
      if (!watch('order_type_id')) {
        const optionDefault = _orderTypeOpts?.find((item)=> item?.order_index === 1)
        setValue('order_type_id', optionDefault?.order_type_id)
      }
      setOrderTypeOpts(_orderTypeOpts);
    });
  };

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

      if (offlineOrderType && !orderId) {
        setValue('order_type_id', offlineOrderType?.value);
        setValue('order_type', offlineOrderType?.type);
      }
    }
  }, [orderTypeOpts, userSchedule, orderId, setValue]);

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

  const getInit = useCallback(async () => {
    try {
      // lấy danh sách options loại đơn hàng
      await fetchOrderType();
    } catch (error) {}
  }, []);

  useEffect(() => {
    getInit();
  }, [getInit]);

  useEffect(() => {
    if (order_type_id && isFirstGetStatus) {
      fetchOrderStatus(null, orderId ? false : true);
      setIsFirstGetStatus(false);
    }
  }, [order_type_id, isFirstGetStatus, fetchOrderStatus, orderId]);

  // load default installment status
  useEffect(() => {
    if (!orderId && watch('installment_type')) {
      fetchOrderStatus(null, orderId ? false : true);
    }
  }, [orderId, watch('installment_type'), fetchOrderStatus]);

  return (
    <BWAccordion title='Thông tin đơn hàng' id='bw_info_cus' isRequired={isOrderFromStocksTransfer ? false : true}>
      <div className='bw_row'>
        <FormItem
          label='Loại đơn hàng'
          className='bw_col_4'
          disabled={disabled}
          isRequired={isOrderFromStocksTransfer ? false : true}>
          <FormDebouneSelect
            field='order_type_id'
            id='order_type_id'
            options={orderTypeOpts}
            allowClear={true}
            style={{ width: '100%' }}
            fetchOptions={fetchOrderType}
            debounceTimeout={700}
            placeholder={'-- Chọn --'}
            validation={{
              required: 'Loại đơn hàng là bắt buộc',
            }}
            onChange={(_, opt) => {
              setValue('order_type_id', opt?.value);
              setValue('order_type', opt?.type);
              setValue('order_type_index', opt?.order_index);
              clearErrors('order_type_id');
              resetProductList(watch, setValue);
              setValue('order_status_id', null);
              fetchOrderStatus(null, true);
              // if (opt?.type === 1 && !user?.isAdministrator && (!userSchedule || userSchedule.length === 0)) {
              //   // 1 là đơn hàng tại offline quầy
              //   showToast.warning('Không thể tạo đơn hàng này vì không có ca làm việc !');
              // }
            }}
          />
        </FormItem>
        <FormItem label='Mã đơn hàng' className='bw_col_4' disabled>
          <FormInput type='text' field='order_no' disabled placeholder='YC0001' />
        </FormItem>
        <FormItem label='Ngày tạo' className='bw_col_4' disabled>
          <FormInput type='text' field='created_date' disabled />
        </FormItem>
        <FormItem
          label='Trạng thái đơn hàng'
          className='bw_col_4'
          disabled
          // disabled={disabled ? disabled : !order_type_id}
        >
          <FormDebouneSelect
            field='order_status_id'
            id='order_status_id'
            options={orderStatusOpts}
            allowClear={true}
            style={{ width: '100%' }}
            fetchOptions={fetchOrderStatus}
            debounceTimeout={700}
            placeholder={'-- Chọn --'}
            validation={{
              required: 'Trạng thái đơn hàng là bắt buộc',
            }}
            onChange={(_, opt) => {
              setValue('order_status_id', opt?.value);
              clearErrors('order_status_id');
            }}
          />
        </FormItem>
        <FormItem label='Trạng thái thanh toán' className='bw_col_4' disabled={true}>
          <FormSelect field='payment_status' list={statusPaymentOpts.filter((_) => _.value !== -1)} />
        </FormItem>
        <FormItem label='Nhân viên tạo đơn' className='bw_col_4' disabled>
          <FormInput type='text' field='created_user' />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default Information;
