import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { showToast } from 'utils/helpers';

import BWAccordion from 'components/shared/BWAccordion/index';
import OrdersModal from './OrdersModal';
import { RECEIPTSOBJECT, ToastStyle } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { getListOrder } from '../actions/index';
import { useCallback } from 'react';
import { useEffect } from 'react';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { formatPrice } from 'utils/index';

const Orders = ({ disabled }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();

  const { watch } = methods;
  const [params, setParams] = useState({
    sort_column: 'created_date',
    sort_direction: 'asc',
  });

  const [showModal, setShowModal] = useState(false);

  const loadOrder = useCallback(() => {
    dispatch(getListOrder(params));
  }, [dispatch, params]);
  useEffect(loadOrder, [loadOrder]);

  return (
    <React.Fragment>
      <BWAccordion title='Thông tin đơn hàng'>
        <div>
          <div className='bw_flex bw_align_items_center bw_justify_content_between bw_mb_1'>
            <p />
            <button
              type='button'
              className='bw_btn bw_btn_success bw_open_modal'
              onClick={() => {
                if (watch('receiver_type') === RECEIPTSOBJECT.CUSTOMER && !watch('receiver_id')) {
                  showToast.warning('Vui lòng chọn Khách hàng!', ToastStyle);
                } else {
                  setShowModal(true);
                  setParams({ ...params, customer_id: methods.watch('receiver_id') });
                }
              }}>
              Chọn đơn hàng
            </button>
          </div>
          <div className='bw_table_responsive'>
            <table className='bw_table bw_mt_1'>
              <thead>
                <tr>
                  <th className='bw_text_center'>STT</th>
                  <th className='bw_text_center'>Mã đơn hàng</th>
                  <th className='bw_text_center'>Khách hàng</th>
                  <th>Giá trị đơn hàng (đ)</th>
                  <th>Tổng tiền đã thu (đ)</th>
                  <th>Thực thu (đ)</th>
                </tr>
              </thead>
              <tbody>
                {watch('order_list') && watch('order_list').length > 0
                  ? watch('order_list').map((order, index) => {
                      return (
                        <tr key={index}>
                          <td className='bw_text_center'> {index + 1} </td>
                          <td className='bw_text_center'>{order?.order_no} </td>
                          <td>
                            <b>{order?.customer_name}</b>
                          </td>
                          <td style={{ textAlign: 'right' }}>{formatPrice(order?.total_amount)} đ</td>
                          <td style={{ textAlign: 'right' }}>{formatPrice(order?.total_paid)} đ</td>
                          <td>
                            <FormNumber
                              min={0}
                              field={`order_list.${index}.actual_collection`}
                              disabled={disabled}
                              bordered={true}
                              style={{ minWidth: '180px' }}
                              addonAfter='đ'
                              controls={false}
                              validation={{
                                required: 'Thực thu là bắt buộc',
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </BWAccordion>
      {showModal && <OrdersModal setShowModal={setShowModal} params={params} setParams={setParams} />}
    </React.Fragment>
  );
};

export default Orders;
