import React from 'react';
import { useFormContext } from 'react-hook-form';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { statusPaymentOpts } from 'pages/Orders/helpers/constans';
import { useEffect } from 'react';
import { useState } from 'react';
import { getListOrderType } from 'pages/OrderType/helpers/call-api';

import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { getListOrderStatus } from 'services/order-status.service';

const Information = () => {
  const methods = useFormContext({});
  const { watch, setValue, clearErrors } = methods;
  const [orderTypeOpts, setOrderTypeOpts] = useState([]);
  const [orderStatusOpts, setOrderStatusOpts] = useState([]);

  // Lấy danh sách loại đơn hàng
  const fetchOrderType = async (value) => {
    ///'services/store.service'
    return getListOrderType({
      search: value,
      is_active: 1,
    }).then((body) => {
      const _orderTypeOpts = body.items.map((_res) => ({
        label: _res.order_type_name,
        value: _res.order_type_id,
        ..._res,
      }));
      setOrderTypeOpts(_orderTypeOpts);
    });
  };

  // Lấy danh sách trạng thái đơn hàng
  const fetchOrderStatus = async (value) => {
    return getListOrderStatus({
      search: value,
      is_active: 1,
      order_type_id: watch('order_type_id'),
    }).then((body) => {
      const _orderStatusOpts = body.items.map((_res) => ({
        label: _res.order_status_name,
        value: _res.order_status_id,
        ..._res,
      }));

      // if (watch('order_type_id')) {
      //   // Mặc định lấy trạng thái đơn là mới nhất
      //   const idxStatusNew = _orderStatusOpts.find((_st) => _st?.is_new_order);
      //   setValue('order_status_id', idxStatusNew?.value);
      //   clearErrors('order_status_id');
      // }
      //set danh sách trạng thái đơn hàng
      setOrderStatusOpts(_orderStatusOpts);
    });
  };
  useEffect(() => {
    // lấy danh sách options loại đơn hàng
    fetchOrderType();
  }, []);

  useEffect(() => {
    if (watch('order_type_id')) {
      fetchOrderStatus();
    }
  }, [watch('order_type_id')]);

  return (
    <BWAccordion title='Thông tin đơn hàng' id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <FormItem label='Loại đơn hàng' className='bw_col_4' disabled isRequired>
          <FormDebouneSelect
            field='order_type_id'
            id='order_type_id'
            options={orderTypeOpts}
            allowClear={true}
            style={{ width: '100%' }}
            fetchOptions={fetchOrderType}
            debounceTimeout={700}
            placeholder={'-- Chọn --'}
          />
        </FormItem>
        <FormItem label='Mã đơn hàng' className='bw_col_4' disabled isRequired>
          <FormInput type='text' field='order_no' disabled placeholder='YC0001' />
        </FormItem>
        <FormItem label='Ngày tạo' className='bw_col_4' disabled isRequired>
          <FormInput type='text' field='created_date' disabled />
        </FormItem>
        <FormItem label='Trạng thái đơn hàng' className='bw_col_4' disabled isRequired>
          <FormDebouneSelect
            field='order_status_id'
            id='order_status_id'
            options={orderStatusOpts}
            allowClear={true}
            style={{ width: '100%' }}
            fetchOptions={fetchOrderStatus}
            debounceTimeout={700}
            placeholder={'-- Chọn --'}
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
