import React, { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { debounce } from 'lodash';

import { paymentFormType } from 'pages/Orders/helpers/constans';
import { handleChangeMoneyPaymentCommon, resetMoneyAndPromotion } from 'pages/Orders/helpers/utils';
import { formatPrice } from 'utils';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import BWImage from 'components/shared/BWImage';
import { getPromotionIsMax } from './AutoGetPromotion'; 

const FormNumberFormat = styled(FormNumber)`
  .ant-input-number-input-wrap > input.ant-input-number-input {
    text-align: right;
  }
  .ant-input-number-input{
    padding: 4px 11px !important;
  }
`;

const BankWrap = styled.div`
  display: flex;
  flwx-wrap: nowrap;
  gap: 6px;

  img {
    height: 36px !important;
    cursor: pointer;
  }

`;

const PaymentFormPreOrder = ({ disabled }) => {
  const methods = useFormContext({});
  const { watch, setValue } = methods;

  const onChangeSelectedDataPayment = useCallback(() => {
    resetMoneyAndPromotion(watch, setValue);
  }, [watch, setValue]);

  const handleChangeMoneyPayment = useCallback(
    (paymentFormIndex, paymentValue, bankIndex) => {
      handleChangeMoneyPaymentCommon(paymentFormIndex, paymentValue, bankIndex, methods);
      const dataPayment = methods.watch('data_payment');
      getPromotionIsMax(methods, 'data_payment', dataPayment);
    },
    [methods],
  );

  const debounceHandleChangeMoneyPayment = debounce(handleChangeMoneyPayment, 100);

  const paymentValueRender = useCallback(
    (paymentForm, index) => {
      if (+paymentForm.payment_type === paymentFormType.CASH) {
        return (
          <div className='bw_row'>
            <div className='bw_col_11'>
              <FormNumberFormat
                addonAfter="đ"
                field={`data_payment.${index}.payment_value`}
                disabled={disabled ? disabled : !watch(`data_payment.${index}.is_checked`)}
                bordered
                controls={false}
                onChange={(value) => {
                  if (paymentForm.payment_type === paymentFormType.CASH) {
                    debounceHandleChangeMoneyPayment(index, value);
                  } else {
                    handleChangeMoneyPayment(index, value);
                  }
                }}
                // validation={{
                //   require: watch(`data_payment.${index}.is_checked`) && `${paymentForm?.payment_name} là bắt buộc.`,
                //   validate: (p) => {
                //     if (p <= 0 && watch(`data_payment.${index}.is_checked`)) {
                //       return 'Giá trị thanh toán phải lớn hơn 0.';
                //     }
                //   },
                // }}
                min={0}
                formatter={(value) => formatPrice(Math.round(value), false, ',')}
              />
            </div>
          </div>
        );
      }else if (+paymentForm.payment_type === paymentFormType.BANK) {
        return (
          <BankWrap>
            {paymentForm?.bank_list?.map((val, idx) => (
              <BWImage src={val?.bank_logo} key={`payment-${index}-bank-${idx}`} preview={false} />
            ))}
          </BankWrap>
        );
      }else if (+paymentForm.payment_type === paymentFormType.PARTNER) {
        return <div className='bw_row'>
            <div className='bw_col_11'>
              <FormNumberFormat
                addonAfter="đ"
                field={`data_payment.${index}.payment_value`}
                disabled={disabled ? disabled : !watch(`data_payment.${index}.is_checked`)}
                bordered
                controls={false}
                onChange={(value) => {
                  if (paymentForm.payment_type === paymentFormType.CASH) {
                    debounceHandleChangeMoneyPayment(index, value);
                  } else {
                    handleChangeMoneyPayment(index, value);
                  }
                }}
                validation={{
                  require: watch(`data_payment.${index}.is_checked`) && `${paymentForm?.payment_name} là bắt buộc.`,
                  validate: (p) => {
                    if (p <= 0 && watch(`data_payment.${index}.is_checked`)) {
                      return 'Giá trị thanh toán phải lớn hơn 0.';
                    }
                  },
                }}
                min={0}
                formatter={(value) => formatPrice(Math.round(value), false, ',')}
              />
            </div>
        
          </div>
      }

    
    },
    [watch, disabled, debounceHandleChangeMoneyPayment, handleChangeMoneyPayment,watch('total_a_mount')],
  );

  return (
    <React.Fragment>
      <div className='bw_row '>
        <div className='bw_col_12 bw_collapse_title'>
          <h3>Hình thức thanh toán</h3>
        </div>
      </div>

      {Boolean(watch('data_payment') && watch('data_payment').length) &&
        watch('data_payment').map(
          (_item, idx) =>
            !Boolean(disabled && !_item.is_checked) && (
              <div className='bw_row bw_mt_2' key={`payment-${idx}`}>
                <div className='bw_col_7'>
                  <div className='bw_row bw_flex bw_align_items_center'>
                    <div className='bw_col_2'>
                      <label className={`bw_checkbox`}>
                        <FormInput
                          type='checkbox'
                          field={`data_payment.${idx}.is_checked`}
                          value={watch(`data_payment.${idx}.is_checked`)}
                          disabled={disabled}
                          onChange={({ target }) => {
                            setValue(`data_payment.${idx}.is_checked`, target.checked);
                            if (_item.payment_type === paymentFormType.CASH) {
                              if (!target.checked) {
                                handleChangeMoneyPayment(idx, 0);
                              } else {
                                handleChangeMoneyPayment(idx, watch('total_a_mount'));
                              }
                            }

                            onChangeSelectedDataPayment();
                          }}
                        />
                        <span />
                      </label>
                    </div>
                    <div className='bw_col_10'>{_item.payment_form_name}</div>
                  </div>
                </div>
                <div className='bw_col_5'>{paymentValueRender(_item, idx)}</div>
              </div>
            ),
        )}
    </React.Fragment>
  );
};

export default PaymentFormPreOrder;
