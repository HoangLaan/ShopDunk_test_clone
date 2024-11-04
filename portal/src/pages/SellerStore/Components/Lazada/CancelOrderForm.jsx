import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';

import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { cancelOrder } from '../../helpers/call-api-lazada';

const CancelOrderForm = ({ onClose, orderCancel, optionsCancel = [], onChange, shop_id, loadingOrder }) => {
  const methods = useForm({});

  const onSubmit = async (payload) => {
    try {
      await cancelOrder({ ...payload, ...orderCancel, shop_id });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      loadingOrder()
      showToast.success('Hủy đơn thành công');
      onClose();
    } catch (error) {
      showToast.error(error ? error?.message : 'Có lỗi xảy ra');
    } finally {
    }
  };

  return (
    <div className='bw_modal bw_modal_open' id='bw_add_customer'>
      {/* {loading && <Loading />} */}
      <div className='bw_modal_container bw_w700 '>
        <div className='bw_title_modal'>
          <h3>Hủy đơn hàng #{orderCancel?.order_id}</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} />
        </div>
        <FormProvider {...methods}>
          <div className='bw_main_modal'>
            <div className='bw_row'>
              <div className='bw_col_12'>
                <FormItem label='Lý do hủy đơn hàng' style='gray' isRequired={true}>
                  <FormSelect
                    field='reason_cancel'
                    id='reason_cancel'
                    list={optionsCancel}
                    onChange={(value) => methods.setValue('reason_cancel', value)}
                    validation={{ required: 'Lý do huỷ đơn là bắt buộc' }}
                  />
                </FormItem>
              </div>
            </div>
          </div>
          <div className='bw_footer_modal bw_mt_1'>
            <button type='button' className='bw_btn bw_btn_success' onClick={methods.handleSubmit(onSubmit)}>
              <span className='fi fi-rr-check' /> Xác nhận hủy đơn
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

export default CancelOrderForm;
