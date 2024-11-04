import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { formatPrice, getErrorMessage } from 'utils/index';
import { paymentFormType } from 'pages/Orders/helpers/constans';
import { getPreOrderCoupon } from 'pages/Orders/helpers/call-api';
import { showToast } from 'utils/helpers';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import ImageCoupon from 'pages/Orders/public/coupon.svg';
import NonImageCoupon from 'pages/Orders/public/non_coupons.png';
import PaymentFormPreOrder from './PaymentFormPreOrder';
import { getCoupon } from 'pages/Orders/helpers/call-api';
import {
  renderDiscountValue,
  handleCheckValueArrayAndToString,
  resetMoneyAndPromotion,
  checkEmptyArray,
} from 'pages/Orders/helpers/utils';
import PromotionModal from 'pages/Orders/components/add/Information/components/PromotionModel/PromotionModal';

const FormNumberFormat = styled(FormNumber)`
  .ant-input-number-input-wrap > input.ant-input-number-input {
    text-align: right;
  }
`;

const CODE_TYPE = {
  MONEY: 1,
  PERCENT: 2,
};

const TYPECOUPON = {
  shopdunk_pre_order: 1,
  coupon_order: 2,
};

const PayingDetailPreOrder = ({ id, title, disabled }) => {
  const methods = useFormContext({});
  const { watch, setValue, reset } = methods;

  const [isShowPromotionModal, setIsShowPromotionModal] = useState(false);

  const promotion_offers = watch('promotion_offers') || [];
  const coupon = watch('coupon');
  const total_money = watch('total_money') || 0;
  const total_discount = watch('total_discount') || 0;
  const sub_total_apply_discount = watch('sub_total_apply_discount') || 0;
  const discount_value = watch('discount_value') || 0;
  const expoint_value = watch('expoint_value') || 0;
  const order_id = watch('order_id') || 0;
  const promotion_apply = watch('promotion_apply');
  const total_paid = watch('total_paid') || 0;

  const resetDataPayment = useCallback(() => {
    const oldDataPayment = watch('data_payment') || [];
    let flag = true;
    setValue(
      'data_payment',
      oldDataPayment.map((item) => {
        if (item.is_checked && item.payment_type === paymentFormType.CASH && flag) {
          flag = false;
          return { ...item, payment_value: watch('total_a_mount') };
        }
        return { ...item, payment_value: 0 };
      }),
    );

    setValue('return_money', 0);
  }, [watch, setValue]);

  const checkItemArrayInObject = (valArr, key, val, valCompare = 0, valueDefault = null) => {
    let result = valueDefault;
    if (valArr && Array.isArray(valArr) && valArr.length > valCompare) {
      result = valArr?.filter((x) => x[key] == val).length;
    }
    return result;
  };

  const updateTotalMoney = useCallback(
    (discount_value, discount_coupon, expoint_value) => {
      const cloneDiscountValue = structuredClone(watch('discount_value'));
      const cloneDiscount = structuredClone(watch('discount_coupon'));
      let discount = 0;
      let discountValue = 0;
      if (cloneDiscount) {
        discount = parseInt(cloneDiscount) ?? 0;
      }

      if (cloneDiscountValue) {
        discountValue = parseInt(cloneDiscountValue) ?? 0;
      }

      if (discount_value) {
        discountValue = parseInt(discount_value) ?? 0;
      }
      const result = discount + discount_coupon;
      setValue('discount_value', discount_value);
      setValue('discount_coupon', result);
      // cap nhat tong giam gia

      setValue('total_discount', discountValue + result);

      //cap nhat gia tri thanh toan
      const sub_total_apply_discount = total_money - (discountValue + result + expoint_value);
      setValue('sub_total_apply_discount', sub_total_apply_discount > 0 ? sub_total_apply_discount : 0);
      setValue('total_a_mount', sub_total_apply_discount - total_paid > 0 ? sub_total_apply_discount - total_paid : 0);
      // resetDataPayment();
    },
    [total_money, watch, setValue, total_paid],
  );

  const handleInputCoupon = useCallback(
    (e) => {
      const products = Object.values(watch('products') || {});
      if (e.keyCode === 13 && products.length) {
        e.preventDefault();
        let checkMemberOrDataLead = 1;
        if (watch('dataleads_id')) {
          checkMemberOrDataLead = 2;
        }
        const cloneDataPayment = structuredClone(watch('data_payment')) ?? [];
        const stringDataPayment = handleCheckValueArrayAndToString(
          cloneDataPayment,
          'is_checked',
          ',',
          '',
          'pay_partner_id',
          1,
        );

        getCoupon({
          pay_parner: stringDataPayment,
          coupon_list: watch('coupon'),
          promotions: promotion_offers,
          order_type_id: watch('order_type_id'),
          order_id: watch('order_id') ?? null,
          products: products,
          member_id: watch('member_id'),
          type_customer: checkMemberOrDataLead,
          customer_id: watch('member_id') ?? watch('dataleads_id'),
          dataleads_id: watch('dataleads_id'),
          coupon_code: e.target.value,
          store_id: watch('store_id'),
          coupon_code_auto: watch('coupon_code'),
          total_money: watch('total_money'),
        })
          .then((res) => {
            if (res?.total_discount) {
              let totalDiscount = res?.total_discount;
              if (res?.type == TYPECOUPON.shopdunk_pre_order) {
                if (res?.total_discount == '-1') {
                  totalDiscount = 0;
                  if (res?.gifts) {
                    checkAndSetGift(res?.gifts);
                  }
                }
                setValue('coupon_code', res?.coupon_name);
              } else if (res?.type == TYPECOUPON.coupon_order) {
                let cloneCoupon = structuredClone(watch('coupon'));
                let valueSet = [];
                if (Array.isArray(cloneCoupon)) {
                  valueSet = cloneCoupon;
                }
                if (res) {
                  if (Array.isArray(cloneCoupon)) {
                    valueSet = [...cloneCoupon, res];
                  } else {
                    if (cloneCoupon) {
                      valueSet = [cloneCoupon, res];
                    } else {
                      valueSet = [res];
                    }
                  }
                }
                setValue('coupon', valueSet);
              }

              updateTotalMoney(discount_value, totalDiscount, expoint_value);
            } else {
              // updateTotalMoney(discount_value, 0, expoint_value);

              showToast.error(
                getErrorMessage({
                  message: 'Mã giảm giá không hợp lệ',
                }),
              );
            }
            e.target.value = '';
          })
          .catch((err) => {
            showToast.error(
              getErrorMessage({
                message: err?.message || 'Đã xảy ra lỗi vui lòng kiểm tra lại.',
              }),
            );
          })
          .finally(() => {
            resetDataPayment();
          });
      }
    },
    [watch, setValue, updateTotalMoney, discount_value, expoint_value, resetDataPayment, sub_total_apply_discount],
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

  const onChangePromotions = useCallback(
    (selected, isPlusPoint) => {
      resetMoneyAndPromotion(watch, setValue);
      let promotion_apply_ = (promotion_apply || [])?.reduce((promotionList, promotion) => {
        const offers = selected?.filter((offer) => offer.promotion_id === promotion.promotion_id);
        if (offers.length > 0) {
          for (let i = 0; i < offers.length; i++) {
            const index = promotion.offers.findIndex(
              (item) => item.promotion_offer_id === offers[i].promotion_offer_id,
            );
            if (index !== -1) {
              promotion.offers[index] = {
                ...promotion.offers[index],
                ...offers[i],
                is_picked: true,
              };

              promotion = {
                ...promotion,
                is_picked: true,
              };
            }
          }
        }

        return [...promotionList, promotion];
      }, []);

      setValue('promotion_apply', promotion_apply_);
      setValue(
        'promotion_offers',
        selected.map((item) => ({ ...item, is_picked: true })),
      );

      let newProducts = Object.values(watch('products') || {}).map((item) => ({ ...item, discount: 0 }));
      let gifts = [];
      const discount_value = selected?.reduce((offerDiscount, curr) => {
        if (
          curr.is_fix_price ||
          curr.is_discount_by_set_price ||
          curr.is_discount_by_set_price ||
          curr.is_percent_discount
        ) {
          // áp dụng giảm giá cho sản phẩm
          if (curr?.offer_product && curr?.offer_product?.length > 0) {
            newProducts = newProducts.map((product) => {
              const find = curr?.offer_product?.find((offer) => offer?.imei_code === product?.imei_code);
              if (find) {
                //tính tổng khuyến mại từ sản phẩm
                offerDiscount += +find?.discount || 0;

                return {
                  ...product,
                  discount_value: +find?.discount || 0,
                };
              }
              return product;
            });

            return offerDiscount;
          }

          return offerDiscount + parseInt(curr?.discount);
        } else if (curr.is_transport) {
          return offerDiscount + parseInt(curr?.shipping_discount);
        } else if (curr.is_fixed_gift) {
          gifts = gifts.concat(
            curr.gifts.map((item) => ({
              ...item,
              promotion_id: curr.promotion_id,
              promotion_offer_id: curr.promotion_offer_id,
            })),
          );
          return offerDiscount;
        }

        return offerDiscount;
      }, 0);

      //products
      setValue('products', newProducts?.reduce((acc, curr) => ({ ...acc, [curr?.product_id]: curr }), {}) || {});

      // gifts
      gifts = gifts.filter((item) => item?.is_picked && item?.quantity > 0);
      let cloneGift = structuredClone(gifts);
      const products = Object.values(watch('products') || {});
      if (products && Array.isArray(products) && products.length > 1 && gifts && gifts.length) {
        for (let i = 1; i < products.length; i++) {
          cloneGift.map((val, index) => {
            if (val) {
              let countProductGift = checkItemArrayInObject(gifts, 'product_id', val?.product_id, 0);
              let lengthIme = 0;
              let imei_code_options = val?.imei_code_options;
              if (imei_code_options && Array.isArray(imei_code_options)) {
                lengthIme = imei_code_options.length;
              }
              if (countProductGift <= lengthIme) {
                gifts.push(val);
              }
            }
          });
        }
      }
      reset(watch());
      setValue('gifts', gifts);

      setValue('coupon', null);
      setValue('coupon_code', null);
      setValue('discount_coupon', 0);

      updateTotalMoney(discount_value, 0, expoint_value);

      setValue('is_plus_point', isPlusPoint);

      setIsShowPromotionModal(false);

      resetDataPayment();
    },
    [promotion_apply, setValue, expoint_value, updateTotalMoney, watch, resetDataPayment, reset],
  );

  // RESET OR ASSIGN GIFT
  const checkAndSetGift = (value, key = 'PUSH') => {
    let cloneGift = structuredClone(watch('gifts'));
    let checkArr = checkEmptyArray(cloneGift);
    if (key == 'RESET' || !checkArr) {
      cloneGift = [];
    }

    if (checkEmptyArray(value)) {
      cloneGift = [...cloneGift, ...value];
    }
    setValue('gifts', cloneGift);
  };

  return (
    <BWAccordion title={title} id={id} isRequired>
      <div className='bw_row'>
        <div className='bw_col_7'>
          <FormItem label='Nội dung' disabled={disabled}>
            <FormTextArea
              style={{ maxWidth: '100%', minWidth: '100%' }}
              rows={3}
              field='description'
              placeholder='Nhập thông tin ghi chú'
            />
          </FormItem>
          <div className='bw_frm_box'>
            <PaymentFormPreOrder disabled={disabled} />
          </div>
        </div>
        <div className='bw_col_5 '>
          {/* nếu đã áp dụng khuyến mãi thì ẩn đi */}
          <div className='bw_frm_box'>
            <div className=' bw_row'>
              <div className='bw_col_12 bw_collapse_title'>
                <h3>Khuyến mại</h3>
              </div>

              <div className='bw_mt_1 bw_col_12'>
                {(coupon && coupon.length) || (promotion_offers && promotion_offers.length) ? (
                  <>
                    {Boolean(promotion_offers && promotion_offers.length > 0) &&
                      promotion_offers
                        .filter((item) => item.is_picked)
                        .map((item, idx) => (
                          <div className='bw_row' key={'promotion-' + idx}>
                            <div className='bw_col_8 '>
                              <h3>{item.promotion_offer_name}</h3>
                            </div>
                            {!Boolean(order_id) && (
                              <div className='bw_col_4 bw_text_right'>{renderDiscountValue(item)}</div>
                            )}
                          </div>
                        ))}

                    {Boolean(coupon && coupon.length && promotion_offers && promotion_offers.length) && (
                      <div className='bw_row' style={{ padding: 10 }}>
                        <div className='bw_col_12 bw_collapse_title' style={{ border: '1px solid #DDDDDD' }}></div>
                      </div>
                    )}
                    {watch('coupon_code') && <h3>Mã {watch('coupon_code')}</h3>}
                    {!!(coupon && coupon.length) &&
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

              {Boolean(!disabled) && (
                <div
                  className='bw_mt_2 bw_col_12 bw_flex bw_justify_content_center bw_align_items_center'
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (
                      total_money &&
                      watch('products') &&
                      Object.keys(watch('products')).length &&
                      (watch('member_id') || watch('dataleads_id'))
                    ) {
                      setIsShowPromotionModal(true);
                    } else {
                      showToast.error(
                        getErrorMessage({
                          message: 'Hãy chọn sản phẩm và khách hàng trước khi chọn khuyến mại',
                        }),
                      );
                    }
                  }}>
                  <img src={ImageCoupon} alt='' style={{ width: '50px', height: '50px' }} />

                  <h3 style={{ marginLeft: 8, color: 'rgb(11, 116, 229)' }}>Chọn chương trình khuyến mại</h3>
                </div>
              )}

              {!disabled ? (
                <div className='bw_row bw_align_items_center' disabled={!watch('stock_id')}>
                  <div className='bw_col_6'>
                    <h3>Nhập mã khuyến mại</h3>
                  </div>
                  <div className='bw_col_6'>
                    <input
                      type='text'
                      placeholder='Nhập mã'
                      className='bw_inp'
                      onKeyDown={handleInputCoupon}
                      style={{ lineHeight: 1 }}
                      disabled={!watch('order_type_id') || (!watch('member_id') && !watch('dataleads_id'))}
                    />
                  </div>
                </div>
              ) : null}
              {/*
              {!disabled && (
                <div className='bw_row bw_align_items_center' disabled={!watch('stock_id')}>
                  <div className='bw_col_6'>
                    <h3>Nhập mã khuyến mại</h3>
                  </div>
                  <div className='bw_col_6'>
                    <input
                      type='text'
                      placeholder='Nhập mã'
                      className='bw_inp'
                      onKeyDown={handleInputCoupon}
                      style={{ lineHeight: 1 }}
                      disabled={!watch('order_type_id') || (!watch('member_id') && !watch('dataleads_id'))}
                    />
                  </div>
                </div>
              )} */}
            </div>
          </div>

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

          {/* <div className='bw_row' style={{ padding: 10 }}>
            <div className='bw_col_12 bw_collapse_title' style={{ border: '1px solid #DDDDDD' }}></div>
          </div> */}

          <div className='bw_frm_box '>
            <div className=' bw_row'>
              <div className='bw_col_7 bw_collapse_title'>
                <h3>
                  <b>Tổng tiền phải thanh toán (tạm tính):</b>
                </h3>
              </div>
              <div className='bw_col_5 bw_collapse_title bw_flex bw_justify_content_right bw_align_items_center'>
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
          {/* {!disabled && (
            <div className='bw_frm_box '>
              <div className='bw_row bw_mt_1'>
                <div className='bw_col_7 bw_collapse_title'>
                  <h3>Tiền mặt nhận từ khách:</h3>
                </div>
                <div className='bw_col_5'>
                  <div className='bw_row'>
                    <div className='bw_col_11 bw_collapse_title bw_flex bw_justify_content_right bw_align_items_center'>
                      <FormNumberFormat
                        field={'receive_money'}
                        disabled={disabled}
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
            </div>
          )} */}
        </div>
      </div>

      {isShowPromotionModal && (
        <PromotionModal
          onClose={() => {
            setIsShowPromotionModal(false);
          }}
          onConfirm={onChangePromotions}
        />
      )}
    </BWAccordion>
  );
};

export default PayingDetailPreOrder;
