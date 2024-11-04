import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { showToast } from 'utils/helpers';
import { formatPrice } from 'utils/index';
import { paymentFormType, paymentStatus } from 'pages/Orders/helpers/constans';
// import { renderDiscountValue } from 'pages/Orders/helpers/utils';
import { getPaymentHistory } from 'pages/Orders/helpers/call-api';
import { getErrorMessage } from 'utils/index';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import NonImageCoupon from 'pages/Orders/public/non_coupons.png';
import ExchangePointApply from 'pages/Orders/components/add/Information/components/add/ExchangePointApply';
import QrCodeModal from './QRCodeModal/QrCodeModal';
import PaymentForm from './PaymentForm';
import PaymentHistory from './PaymentHistory';
import { resetDataPayment } from 'pages/Orders/helpers/utils';

const CODE_TYPE = {
  MONEY: 1,
  PERCENT: 2,
};

const FormNumberFormat = styled(FormNumber)`
  .ant-input-number-input-wrap > input.ant-input-number-input {
    text-align: right;
  }
`;

const PayingDetail = ({ id, title, setLoading, loadOrderDetail }) => {
  const methods = useFormContext({});
  const { watch, setValue } = methods;

  const [isShowQrCodeModal, setIsShowQrCodeModal] = useState(false);
  const [bankData, setBankData] = useState({});
  const [paymentValue, setPaymentValue] = useState(0);
  const [paymentFormData, setPaymentFormData] = useState({});
  const [paymentHistory, setPaymentHistory] = useState([]);

  const data_payment = watch('data_payment') || [];
  const promotion_offers = watch('promotion_offers') || [];
  const coupon = watch('coupon');
  const total_paid = watch('total_paid') || 0;
  const total_money = watch('total_money') || 0;
  const total_discount = watch('total_discount') || 0;
  const sub_total_apply_discount = watch('sub_total_apply_discount') || 0;
  const is_plus_point = watch('is_plus_point') || 0;
  const order_id = watch('order_id') || '';
  const order_no = watch('order_no') || '';
  // const products = Object.values(watch('products') || {});

  // tạm thời disable chức năng này
  // nếu có sản phẩm chưa có imei thì redirect về trang chỉnh sửa
  // useEffect(() => {
  //   if (products.length && order_id) {
  //     const findIndex = products.findIndex((item) => !Boolean(item.imei_code));
  //     if (findIndex > -1) {
  //       showToast.error('Vui lòng nhập đủ imei cho sản phẩm trước khi thanh toán');
  //       window._$g.rdr(`/orders/edit/${order_id}`);
  //     }
  //   }
  // }, [products, order_id]);

  const loadPaymentHistory = useCallback(() => {
    if (order_id) {
      setLoading(true);

      getPaymentHistory(order_id)
        .then((res) => {
          setPaymentHistory(res);
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
  }, [order_id, setPaymentHistory, setLoading]);

  useEffect(loadPaymentHistory, [loadPaymentHistory]);

  const updateTotalMoney = useCallback(
    (discount_value, discount_coupon, expoint_value) => {
      setValue('discount_value', discount_value);
      setValue('discount_coupon', discount_coupon);
      //cap nhat gia tri thanh toan
      setValue('total_discount', discount_value + discount_coupon + expoint_value);

      const sub_total_apply_discount = total_money - (discount_value + discount_coupon + expoint_value);
      setValue('sub_total_apply_discount', sub_total_apply_discount > 0 ? sub_total_apply_discount : 0);
      setValue('total_a_mount', sub_total_apply_discount - total_paid > 0 ? sub_total_apply_discount - total_paid : 0);
      resetDataPayment(data_payment, sub_total_apply_discount - total_paid, setValue);
    },
    [total_money, setValue, total_paid, data_payment],
  );

  const handleChangeReceiveMoney = (value) => {
    setValue('receive_money', value);

    const data_payment = watch('data_payment') || [];

    // Tính tổng tiền trả lại
    const total_cash_money =
      data_payment
        ?.filter((v) => v.is_checked)
        ?.reduce((acc, curr) => {
          if (curr.payment_type === paymentFormType.CASH) {
            acc += +curr.payment_value || 0;
          }
          return acc;
        }, 0) || 0;

    const total_return_money = value - total_cash_money;

    setValue(`return_money`, total_return_money > 0 ? total_return_money : 0);
  };

  return (
    <BWAccordion title={title} id={id} isRequired>
      <div className='bw_row'>
        <div className='bw_col_7'>
          {/* Note */}
          <FormItem label='Nội dung' disabled>
            <FormTextArea
              style={{ maxWidth: '100%', minWidth: '100%' }}
              rows={3}
              field='description'
              placeholder='Nhập thông tin ghi chú'
            />
          </FormItem>

          {/* Payment form */}
          {+watch('payment_status') !== paymentStatus.PAID && (
            <div className='bw_frm_box'>
              {/* {watch('order_type') === orderType.INSTALLMENT_OFFLINE ||
              watch('order_type') === orderType.INSTALLMENT_OFFLINE ? (
                <PaymentInstallmentForm />
              ) : (
                <PaymentForm
                setBankData={setBankData}
                setPaymentValue={setPaymentValue}
                setPaymentFormData={setPaymentFormData}
                setLoading={setLoading}
                setIsShowQrCodeModal={setIsShowQrCodeModal}
                loadOrderDetail={loadOrderDetail}
                loadPaymentHistory={loadPaymentHistory}
              />
              )} */}
              <PaymentForm
                setBankData={setBankData}
                setPaymentValue={setPaymentValue}
                setPaymentFormData={setPaymentFormData}
                setLoading={setLoading}
                setIsShowQrCodeModal={setIsShowQrCodeModal}
                loadOrderDetail={loadOrderDetail}
                loadPaymentHistory={loadPaymentHistory}
              />
            </div>
          )}

          {Boolean(paymentHistory?.length) && (
            <div className='bw_frm_box'>
              <PaymentHistory setLoading={setLoading} paymentHistory={paymentHistory} />
            </div>
          )}
        </div>
        <div className='bw_col_5 '>
          {/* Promotion */}
          <div className='bw_frm_box'>
            <div className=' bw_row'>
              <div className='bw_col_12 bw_collapse_title'>
                <h3>Khuyến mại</h3>
              </div>
              <div className='bw_mt_1 bw_col_12'>
                {coupon || (promotion_offers && promotion_offers.length) ? (
                  <>
                    {Boolean(promotion_offers && promotion_offers.length > 0) &&
                      promotion_offers
                        .filter((item) => item.is_picked)
                        .map((item, idx) => (
                          <div className='bw_row' key={'promotion-' + idx}>
                            <div className='bw_col_8 '>
                              <h3>{item.promotion_offer_name}</h3>
                            </div>
                            {/* <div className='bw_col_4 bw_text_right'>{renderDiscountValue(item)}</div> */}
                          </div>
                        ))}

                    {/* {Boolean(coupon && promotion_offers && promotion_offers.length) && (
                      <div className='bw_row' style={{ padding: 10 }}>
                        <div className='bw_col_12 bw_collapse_title' style={{ border: '1px solid #DDDDDD' }}></div>
                      </div>
                    )} */}

                    {watch('coupon_code') && <h3>Mã {watch('coupon_code')}</h3>}
                    {coupon &&
                      coupon?.map((val, index) => {
                        return (
                          <div className='bw_row'>
                            <div className='bw_col_6 '>
                              <h3>{`${val?.coupon_name}: ${val?.coupon_code}`}</h3>
                            </div>
                            <div className='bw_col_6 bw_text_right'>
                              {val.code_type === CODE_TYPE.MONEY ? (
                                <b>{formatPrice(Math.round(val?.code_value), true, ',')}</b>
                              ) : val.code_type === CODE_TYPE.PERCENT ? (
                                <b>
                                  {val?.code_value} % {`(${formatPrice(Math.round(val?.total_discount), true, ',')})`}
                                </b>
                              ) : (
                                ''
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </>
                ) : (
                  <div className='bw_col_12 bw_flex bw_align_items_center bw_justify_content_center'>
                    <img style={{ width: '50px', height: '50px' }} src={NonImageCoupon} alt='' />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Total money */}
          <div className=' bw_frm_box'>
            <div className='bw_row '>
              <div className='bw_col_7 bw_collapse_title'>
                <h3>Tổng tiền hàng:</h3>
              </div>
              <div className='bw_col_5 bw_collapse_title bw_flex bw_justify_content_right bw_align_items_center'>
                <h3>{formatPrice(Math.round(total_money - watch('total_vat')), true, ',')}</h3>
              </div>
            </div>

            <div className='bw_row bw_mt_1'>
              <div className='bw_col_7 bw_collapse_title'>
                <h3>Tổng VAT:</h3>
              </div>
              <div className='bw_col_5 bw_collapse_title bw_flex bw_justify_content_right bw_align_items_center'>
                <h3>{formatPrice(Math.round(watch('total_vat')), true, ',')}</h3>
              </div>
            </div>

            <div className='bw_row bw_mt_1'>
              <div className='bw_col_7 bw_collapse_title'>
                <h3>Phí vận chuyển (tạm tính):</h3>
              </div>
              <div className='bw_col_5 bw_collapse_title bw_flex bw_justify_content_right bw_align_items_center'>
                <h3>{formatPrice(Math.round(watch('transport_fee') || 0), true, ',')}</h3>
              </div>
            </div>

            <div className='bw_row bw_mt_1'>
              <div className='bw_col_7 bw_collapse_title'>
                <h3>Khuyến mại:</h3>
              </div>
              <div className='bw_col_5 bw_collapse_title bw_flex bw_justify_content_right bw_align_items_center'>
                <h3>{formatPrice(Math.round(total_discount), true, ',')}</h3>
              </div>
            </div>

            <div className='bw_row bw_mt_1'>
              <div className='bw_col_7 bw_collapse_title'>
                <h3>Đặt cọc:</h3>
              </div>
              <div className='bw_col_5 bw_collapse_title bw_flex bw_justify_content_right bw_align_items_center'>
                <h3>{formatPrice(Math.round(watch('premoney') || 0), true, ',')}</h3>
              </div>
            </div>
          </div>

          {Boolean(is_plus_point) && (
            <div className='bw_frm_box'>
              <ExchangePointApply updateTotalMoney={updateTotalMoney} disabled />
            </div>
          )}

          <div className='bw_frm_box '>
            <div className=' bw_row'>
              <div className='bw_col_8 bw_collapse_title'>
                <h3>
                  <b>Tổng tiền phải thanh toán (tạm tính):</b>
                </h3>
              </div>
              <div className='bw_col_4 bw_collapse_title bw_flex bw_justify_content_right bw_align_items_center'>
                <b className='bw_red'>{formatPrice(Math.round(sub_total_apply_discount), true, ',')}</b>
              </div>
            </div>

            <div className=' bw_row bw_mt_1'>
              <div className='bw_col_8 bw_collapse_title'>
                <h3>
                  <b>Tổng tiền còn lại:</b>  
                </h3>
              </div>
              <div className='bw_col_4 bw_collapse_title bw_flex bw_justify_content_right bw_align_items_center'>
                <b className=''>{formatPrice(Math.round(watch('total_a_mount')), true, ',')}</b>
              </div>
            </div>
          </div>
          
          {/* Comment Tiền nhận và trả lại từ khách */}
          {/* <div className='bw_frm_box '>
            <div className='bw_row bw_mt_1'>
              <div className='bw_col_7 bw_collapse_title'>
                <h3>Tiền mặt nhận từ khách:</h3>
              </div>
              <div className='bw_col_5'>
                <div className='bw_row'>
                  <div className='bw_col_11 bw_collapse_title bw_flex bw_justify_content_right bw_align_items_center'>
                    <FormNumberFormat
                      field={'receive_money'}
                      className='bw_inp'
                      bordered
                      controls={false}
                      style={{ padding: '2px 16px' }}
                      onChange={(value) => {
                        handleChangeReceiveMoney(value);
                      }}
                      min={0}
                      formatter={(value) => formatPrice(Math.round(value), false, ',')}
                    />
                  </div>
                  <div className='bw_col_1 bw_collapse_title bw_flex bw_justify_content_right bw_align_items_center'>
                    <h3>đ</h3>
                  </div>
                </div>
              </div>
            </div>

            {Boolean(watch('return_money')) && (
              <div className='bw_row bw_mt_1'>
                <div className='bw_col_7 bw_collapse_title'>
                  <h3>Tiền thừa trả khách:</h3>
                </div>
                <div className='bw_col_5 bw_collapse_title bw_flex bw_justify_content_right bw_align_items_center'>
                  <h3>{formatPrice(Math.round(watch('return_money')), true, ',')}</h3>
                </div>
              </div>
            )}
          </div> */}
        </div>
      </div>

      {isShowQrCodeModal && (
        <QrCodeModal
          onClose={() => {
            setIsShowQrCodeModal(false);
            loadOrderDetail();
            loadPaymentHistory();
          }}
          bankData={bankData}
          paymentFormData={paymentFormData}
          amount={paymentValue}
          orderNo={order_no}
        />
      )}
    </BWAccordion>
  );
};

export default PayingDetail;
