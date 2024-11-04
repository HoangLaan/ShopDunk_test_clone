import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { createCustomer } from 'services/customer.service';
import { Radio } from 'antd';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { shipOrder } from '../../helpers/call-api-shopee';
import styled from 'styled-components';
import { convertTimeStampToDate, convertArrayToObjectShopeeOrder } from '../../helpers/constaint';

const StyledH3 = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin: 7px 0;
  margin-top: 15px;
`;

const StyledTagP = styled.p`
  font-size: 14px;
  margin: 7px 0;
`;

const StyledTagdiv = styled.div`
  font-size: 14px;
  margin: 7px 0;
`;

const ShippingOrderForm = ({ onClose, orderCancel, optionShipping = [], onChange, shop_id, list_order }) => {
  const methods = useForm({
    defaultValues: {
      type_shipping: 'pick_up',
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    methods.setValue('list_order', convertArrayToObjectShopeeOrder(list_order));
  }, []);

  const onChangeRaioButton = (e) => {};

  const onSubmit = async (payload) => {
    try {
      let { list_order = {} } = payload;
      let isPick = (Object.values(list_order) || []).filter((order) => {
        if (!order?.pick_up && (!order?.pick_up?.address_id || !order?.pick_up?.pickup_time_id)) {
          return order;
        }
      });
      if (isPick && isPick?.length > 0) {
        showToast.error('Vui lòng chọn ngày DVVC đến lấy hàng', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        return;
      } else {
        let result = await shipOrder({ shop_id, ...payload });
        let { listOrderConfirm = [] } = result || {};
        let is_not_pass = (listOrderConfirm || []).filter((item) => !item?.is_pass);
        if (is_not_pass && is_not_pass?.length > 0) {
          let mess = (is_not_pass || []).map((item) => item?.order_sn).join(', ');
          let msg = `Mã đơn hàng đồng bộ bị lỗi: (${mess}). Vui lòng thử lại </b>`;
          showToast.error(`${msg}`, {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
          return;
        }
        onChange(payload);
        onClose();
      }
    } catch (error) {
      showToast.error(error ? error?.message : 'Có lỗi xảy ra!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } finally {
      setLoading(false);
    }
  };

  const onChangeDatePickUp = (e) => {
    let list_temp = methods.watch('list_order');
    let pick_up = (e.target.value || '').split('_');
    let order_sn = pick_up && pick_up?.length > 0 && pick_up[2] ? pick_up[2] : '';
    let object = {
      order_sn: order_sn,
      pick_up: {
        address_id: parseInt(pick_up && pick_up.length > 0 && pick_up[0] ? pick_up[0] : 0),
        pickup_time_id: pick_up && pick_up.length > 1 && pick_up[1] ? pick_up[1] : 0,
      },
    };
    list_temp[order_sn] = { ...list_temp[order_sn], ...object, type_shipping: e.target.value };
    methods.setValue('list_order', list_temp);
  };

  return (
    <div className='bw_modal bw_modal_open' id='bw_add_customer'>
      {/* {loading && <Loading />} */}
      <div className='bw_modal_container bw_w900 '>
        <div className='bw_title_modal'>
          <h3>Xác nhận/Giao đơn hàng</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} />
        </div>
        <FormProvider {...methods}>
          <div className='bw_main_modal'>
            <div className='bw_row'>
              <StyledH3>Phương thức lấy hàng</StyledH3>
              <div className='bw_col_12'>
                <FormItem>
                  <div className='bw_flex bw_align_items_center'>
                    <label className='bw_radio'>
                      <input
                        onChange={(e) => methods.setValue('type_shipping', 'pick_up')}
                        type='radio'
                        checked={methods.watch('type_shipping') == 'pick_up'}
                      />
                      <span></span>
                      Hãng VC đến lấy hàng
                    </label>
                    <label className='bw_radio'>
                      <input
                        onChange={(e) => methods.setValue('type_shipping', 'drop_up')}
                        type='radio'
                        checked={methods.watch('type_shipping') == 'drop_up'}
                        disabled
                      />
                      <span></span>
                      Tự mang hàng đến bưu cục
                    </label>
                  </div>
                </FormItem>
              </div>
              <StyledH3 className='bw_col_12'>Phương thức lấy hàng</StyledH3>
              <StyledTagP className='bw_col_12'>
                Ngày hẹn giao hàng bị giới hạn bởi đơn hàng có thời gian giao hàng ngắn nhất
              </StyledTagP>
              <div className='bw_col_12'>
                {(optionShipping || []).map((item, index) => {
                  let { dropoff = {}, pickup = {} } = item;
                  let { address_list = [] } = pickup || {};
                  return (
                    <>
                      <StyledTagdiv>
                        Mã đơn hàng : <b>{item?.order_sn}</b>
                      </StyledTagdiv>
                      {address_list && address_list.length > 0 ? (
                        <div className='bw_flex bw_align_items_center'>
                          <FormItem>
                            {(address_list || []).map((address, index_address) => {
                              let { time_slot_list = [], address_flag = [] } = address || {};
                              let is_pickup = (address_flag || []).find((item) => item == 'pickup_address');
                              return (
                                <>
                                  {time_slot_list && is_pickup && time_slot_list.length > 0
                                    ? (time_slot_list || []).map((time, index_time) => {
                                        return (
                                          <label
                                            className='bw_radio'
                                            key={`${address?.address_id}_${time?.pickup_time_id}_${item?.order_sn}`}>
                                            <input
                                              onChange={(e) => {
                                                onChangeDatePickUp(e);
                                              }}
                                              type='radio'
                                              value={`${address?.address_id}_${time?.pickup_time_id}_${item?.order_sn}`}
                                              // checked={methods.watch('type_shipping') == 'pick_up'}
                                            />
                                            <span></span>
                                            {address?.state}
                                            {convertTimeStampToDate(time?.date)}
                                          </label>
                                        );
                                      })
                                    : null}
                                </>
                              );
                            })}
                          </FormItem>
                        </div>
                      ) : null}
                    </>
                  );
                })}
              </div>
              <StyledH3 className='bw_col_12'>Địa chỉ lấy hàng</StyledH3>
              <StyledTagP className='bw_col_12'>
                Địa chỉ lấy hàng là địa chỉ lấy hàng hoặc địa chỉ mặc định của từng shop thiết lập trên Shopee
              </StyledTagP>
            </div>
          </div>
          <div className='bw_footer_modal bw_mt_1'>
            <button type='button' className='bw_btn bw_btn_success' onClick={methods.handleSubmit(onSubmit)}>
              <span className='fi fi-rr-check' /> Xác nhận đơn hàng
            </button>
            <button type='button' className='bw_btn_outline bw_close_modal' onClick={onClose}>
              Đóng
            </button>
          </div>
        </FormProvider>
      </div>
    </div>
  );
};

export default ShippingOrderForm;
