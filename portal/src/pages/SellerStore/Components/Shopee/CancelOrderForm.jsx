import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { cancelOrder } from '../../helpers/call-api-shopee';
import { Checkbox } from 'antd';
import { convertArrayToObjectShopee } from '../../helpers/constaint';

const CancelOrderForm = ({ onClose, orderCancel, optionsCancel = [], onChange, shop_id }) => {
  const methods = useForm({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    methods.setValue('orderCancel', orderCancel);
  }, []);

  const onSubmit = async (payload) => {
    try {
      let result = await cancelOrder({ ...payload, shop_id });
      setLoading(true);
      showToast.success(`Hủy đơn thành công !!!`, {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      onClose();
      onChange({
        page: 1,
        itemsPerPage: 10,
        order_type: 'CANCELLED',
      });
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

  const onChangeChecked = (e) => {
    let { item_list = [] } = methods.watch('orderCancel') || {};
    let list_item_cancel = convertArrayToObjectShopee(item_list);
    if (e.target.checked) {
      list_item_cancel[e.target.value?.item_id] = { ...e.target.value, is_out_stock: true };
    } else {
      list_item_cancel[e.target.value?.item_id] = { ...e.target.value, is_out_stock: false };
    }
    methods.setValue('orderCancel', { ...methods.watch('orderCancel'), item_list: Object.values(list_item_cancel) });
  };

  const RenderTableCancel = () => {
    let { item_list = [] } = methods.watch('orderCancel') || {};
    if (methods.watch('reason_cancel') && methods.watch('reason_cancel') != '') {
      return (
        <div className='bw_table_responsive bw_mt_2'>
          <table className='bw_table'>
            <thead>
              <tr>
                <th ColSpan={2} style={{ padding: '15px' }}>
                  Vui lòng chọn sản phẩm đã hết hàng
                </th>
              </tr>
            </thead>
            <tbody>
              {(item_list || []).map((product, index) => {
                let { image_info = {} } = product || {};
                let checked = product?.is_out_stock ? true : false;
                return (
                  <>
                    <tr>
                      <td style={{ width: '5vh' }}>
                        <Checkbox onChange={onChangeChecked} checked={checked} value={product} />
                      </td>
                      <td>
                        <>
                          <div
                            className='containter-item-detail mb-2'
                            key={`order_item_${product?.item_id}`}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              // width: `3rem`,
                              // height: '3rem',
                              // maxWidth: '3rem',
                              // position: 'relative',
                            }}>
                            <div
                              style={{
                                display: 'flex',
                              }}>
                              <img
                                alt='image'
                                src={image_info?.image_url}
                                style={{
                                  width: '3rem',
                                  height: '3rem',
                                  marginRight: '20px',
                                  maxWidth: '3rem',
                                  minHeight: '3rem',
                                  maxHeight: '3rem',
                                  objectFit: 'cover',
                                }}
                              />
                              <div>
                                <div
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                  }}>
                                  {product?.item_name}
                                </div>
                                <div>SL: {product?.model_quantity_purchased}</div>
                              </div>
                            </div>
                          </div>
                        </>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className='bw_modal bw_modal_open' id='bw_add_customer'>
      {/* {loading && <Loading />} */}
      <div className='bw_modal_container bw_w700 '>
        <div className='bw_title_modal'>
          <h3>Hủy đơn hàng #{methods.watch('orderCancel')?.order_sn}</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} />
        </div>
        <FormProvider {...methods}>
          <div className='bw_main_modal'>
            <div className='bw_row'>
              <div className='bw_col_6'>
                <FormItem label='Lý do hủy đơn hàng' className='bw_col_12'>
                  <FormSelect
                    field='reason_cancel'
                    id='reason_cancel'
                    list={optionsCancel}
                    allowClear={true}
                    onChange={(value) => methods.setValue('reason_cancel', value)}
                  />
                </FormItem>
              </div>
            </div>
            <div className='bw_row'>
              <div className='bw_col_12'>{methods.watch('orderCancel') ? RenderTableCancel() : null}</div>
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
// disabled={true}
