import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { debounce } from 'lodash';
import { Tooltip } from 'antd';
import { showToast } from 'utils/helpers';
import { useDispatch } from 'react-redux';

import { orderType } from 'pages/Orders/helpers/constans';
import { paymentFormType, paymentStatus } from 'pages/Orders/helpers/constans';
import { handleChangeMoneyPaymentCommon } from 'pages/Orders/helpers/utils';
import { formatPrice, getErrorMessage } from 'utils';
import { showConfirmModal } from 'actions/global';
import { cashPayment } from 'pages/Orders/helpers/call-api';

import FormNumber from 'components/shared/BWFormControl/FormNumber';
import BWImage from 'components/shared/BWImage';
import BWButton from 'components/shared/BWButton';
import { useHistory } from 'react-router-dom';
import InstallmentPaymentModal from '../add/Information/components/PaymentModal/IntallmentPaymentModal';
import PaymentResultModal from './Modal/PaymentResultModal';
import {
  read,
  update,
} from 'pages/Orders/helpers/call-api';
import { getList } from 'services/customer-of-task.service';
import { changeWorkFlow } from 'services/customer-of-task.service';

const FormNumberFormat = styled(FormNumber)`
  .ant-input-number-input-wrap > input.ant-input-number-input {
    text-align: right;
  }
  .ant-input-number-input {
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

const InstallmentPayment = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
`;

const BASE_URL = process.env.REACT_APP_BASE_URL;

const PaymentForm = ({
  setBankData,
  setPaymentValue,
  setPaymentFormData,
  setLoading,
  setIsShowQrCodeModal,
  loadOrderDetail,
  loadPaymentHistory,
}) => {
  const dispatch = useDispatch();
  const methods = useFormContext({});
  const { watch, setValue } = methods;

  const [queryParams, setQueryParams] = useState({});
  const history = useHistory();
  const [openModalPayment, setOpenModalPayment] = useState(false);
  const [openResultModal, setOpenResultModal] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    const params = Object.fromEntries(searchParams);
    setQueryParams(params);
    if (params.vpc_TxnResponseCode && params.vpc_TransactionNo) {
      setOpenResultModal(true);
    }
  }, [history]);

  const order_id = watch('order_id') || '';

  const handleSubmitTaskDetailId = async () => {
    // const formData = methods.getValues()
    console.log('Vao handleSubmitTaskDetailId  PaymentForm');
    try {
      if (order_id) {
        const res = await read(order_id)
        console.log('[[ Get order Detail de check ]]', 'out_stock_status === ', res?.out_stock_status, 'payment_status ===', res?.payment_status);
        if (+res?.out_stock_status === 1 && +res?.payment_status === 1) {
          const getCustomerOfTask = await getList({ search: res?.dataleads_id ? res?.dataleads_id : res?.customer_code })
          if (getCustomerOfTask?.items?.length > 0) {
            const listTaskDetailId = getCustomerOfTask?.items?.filter(item => item.type_purchase !== 1 && item.type_purchase !== 0)?.map(item => parseInt(item.task_detail_id));

            if (listTaskDetailId?.length > 0) {
              res.task_detail_id = JSON.stringify(listTaskDetailId)
            }

            await update(order_id, res)

            if (listTaskDetailId?.length > 1) {
              console.log('vao TH2 ---> 55');
              getCustomerOfTask?.items?.filter(item => item.type_purchase !== 1 && item.type_purchase !== 0)?.forEach(item => {
                if (!item.order_no && !item.order_date) {
                  changeWorkFlow({
                    task_detail_id: item.task_detail_id,
                    task_workflow_old_id: item.task_work_flow_id,
                    task_workflow_id: 55,
                  });
                }
              });
            } else if (listTaskDetailId?.length === 1) {
              console.log('vao TH1 ---> 54');
              getCustomerOfTask?.items?.filter(item => item.type_purchase !== 1 && item.type_purchase !== 0)?.forEach(item => {
                if (!item.order_no && !item.order_date) {
                  changeWorkFlow({
                    task_detail_id: item.task_detail_id,
                    task_workflow_old_id: item.task_work_flow_id,
                    task_workflow_id: 55,
                  });
                }
              });
            }
          }
        }
      }
    } catch (error) {
      showToast.error(
        getErrorMessage({
          message: error?.message || 'Đã xảy ra lỗi vui lòng kiểm tra lại.',
        }),
      );
    }
  };

  const onConfirmCashPayment = (paymentForm) => {
    // tính tổng tiền mặt đã nhập
    const data_payment = watch('data_payment') || [];
    let total_cash_payment = data_payment.reduce(
      (acc, curr) => {
        if (+curr.payment_type === paymentFormType.CASH) {
          acc += curr.payment_value || 0;
        }
        return acc;
      },

      0,
    );

    dispatch(
      showConfirmModal(
        ['Xác nhận thu tiền mặt', `Bạn đã thu đủ số tiền là ${formatPrice(total_cash_payment, true, ',')} ?`],
        () => {
          setLoading(true);

          cashPayment({
            order_id,
            member_id: watch('member_id'),
            dataleads_id: watch('dataleads_id'),
            payment_form_id: paymentForm.payment_form_id,
            description: watch('description') || `Thu tiền hàng theo mã đơn hàng ${watch('order_no')}`,
            payment_value: paymentForm.payment_value,
            payment_type: paymentForm.payment_type,
          })
            .then((res) => {
              showToast.success(
                getErrorMessage({
                  message: res?.message || 'Thanh toán đơn hàng thành công',
                }),
              );
            })
            .catch((error) => {
              showToast.error(
                getErrorMessage({
                  message: error?.message || 'Đã xảy ra lỗi vui lòng kiểm tra lại.',
                }),
              );
            })
            .finally(() => {
              console.log('Confirm  Cash');
              loadOrderDetail();
              loadPaymentHistory();
              handleSubmitTaskDetailId();
            });
        },
        'Xác nhận',
      ),
    );
  };

  const onConfirmPartnerPayment = (paymentForm) => {
    dispatch(
      showConfirmModal(
        [
          `Xác nhận thu tiền ${paymentForm.payment_form_name}`,
          `Bạn đã thu đủ số tiền là ${formatPrice(paymentForm.payment_value, true, ',')} ?`,
        ],
        () => {
          setLoading(true);

          cashPayment({
            order_id,
            member_id: watch('member_id'),
            dataleads_id: watch('dataleads_id'),
            payment_form_id: paymentForm.payment_form_id,
            description: watch('description') || `Thu tiền hàng theo mã đơn hàng ${watch('order_no')}`,
            payment_value: paymentForm.payment_value,
          })
            .then((res) => {
              showToast.success(
                getErrorMessage({
                  message: res?.message || 'Thanh toán đơn hàng thành công',
                }),
              );
            })
            .catch((error) => {
              showToast.error(
                getErrorMessage({
                  message: error?.message || 'Đã xảy ra lỗi vui lòng kiểm tra lại.',
                }),
              );
            })
            .finally(() => {
              console.log('Confirm  Partner');
              loadOrderDetail();
              loadPaymentHistory();
              handleSubmitTaskDetailId();
            });
        },
        'Xác nhận',
      ),
    );
  };

  const handleChangeMoneyPayment = useCallback(
    (paymentFormIndex, paymentValue, bankIndex) => {
      handleChangeMoneyPaymentCommon(paymentFormIndex, paymentValue, bankIndex, methods);
    },
    [methods],
  );

  const debounceHandleChangeMoneyPayment = debounce(handleChangeMoneyPayment, 1000);

  const paymentStatusRender = (paymentForm, index) => {
    if (+paymentForm.payment_type === paymentFormType.CASH) {
      return (
        <>
          <div className='bw_col_3'>
            <FormNumberFormat
              addonAfter='đ'
              field={`data_payment.${index}.payment_value`}
              disabled={watch('payment_status') === paymentStatus.PAID || watch('finance_company_confirmed') === 1}
              bordered
              controls={false}
              formatter={(value) => formatPrice(Math.round(value), false, ',')}
              onChange={(value) => { }}
              onBlur={(event) => {
                const paymentValue = parseInt(`${event?.target?.value}`?.replaceAll(',', '') || 0);
                handleChangeMoneyPayment(index, paymentValue);
              }}
            />
          </div>
          {paymentForm.payment_value > 0 && (
            <div className='bw_col_3 bw_flex bw_align_items_center'>
              <span
                class='bw_label_outline bw_label_outline_success text-center'
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (paymentForm.payment_value > 0) {
                    onConfirmCashPayment(paymentForm);
                  }
                }}>
                Xác nhận
              </span>
            </div>
          )}
        </>
      );
    } else if (+paymentForm.payment_type === paymentFormType.BANK) {
      return (
        <BankWrap className='bw_col_4'>
          {paymentForm?.bank_list?.map((bank, idx) => (
            <Tooltip
              title={
                <div className='bw_row'>
                  <div className='bw_col_8'>
                    <div className='bw_row'>
                      <div className='bw_col_11'>
                        <FormNumberFormat
                          field={`data_payment.${index}.bank_list.${idx}.payment_value`}
                          disabled={
                            watch('payment_status') === paymentStatus.PAID || watch('finance_company_confirmed') === 1
                          }
                          className='bw_inp'
                          bordered
                          controls={false}
                          style={{ padding: '2px 16px' }}
                          onChange={(value) => {
                            handleChangeMoneyPayment(index, value, idx);
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
                  <div className='bw_col_4 bw_flex bw_align_items_center'>
                    <span
                      class='bw_label_outline bw_label_outline_success text-center'
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        if (bank.payment_value > 0) {
                          e.preventDefault();
                          setIsShowQrCodeModal(true);
                          setBankData(bank);
                          setPaymentValue(bank?.payment_value || 0);
                          setPaymentFormData(paymentForm);
                          setValue(`data_payment.${index}.bank_list.${idx}.open`, false);
                        }
                      }}>
                      Xác nhận
                    </span>
                  </div>
                </div>
              }
              trigger='click'
              color='white'
              zIndex={10}
              open={!!bank?.open}>
              <BWImage
                src={bank?.bank_logo}
                key={`payment-${index}-bank-${idx}`}
                preview={false}
                onClick={() => {
                  setValue(`data_payment.${index}.bank_list.${idx}.open`, !bank?.open);
                }}
              />
            </Tooltip>
          ))}
        </BankWrap>
      );
    } else if (+paymentForm.payment_type === paymentFormType.PARTNER) {
      return (
        <>
          <div className='bw_col_3'>
            <FormNumberFormat
              addonAfter='đ'
              field={`data_payment.${index}.payment_value`}
              disabled={watch('payment_status') === paymentStatus.PAID || watch('finance_company_confirmed') === 1}
              bordered
              controls={false}
              formatter={(value) => formatPrice(Math.round(value), false, ',')}
              onChange={(value) => {
                // debounceHandleChangeMoneyPayment(index, value);
              }}
              onBlur={(event) => {
                const paymentValue = parseInt(`${event?.target?.value}`?.replaceAll(',', '') || 0);
                handleChangeMoneyPayment(index, paymentValue);
              }}
            />
          </div>

          {paymentForm.payment_value > 0 && (
            <div className='bw_col_3 bw_flex bw_align_items_center'>
              <span
                class='bw_label_outline bw_label_outline_success text-center'
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (paymentForm.payment_value > 0) {
                    onConfirmPartnerPayment(paymentForm);
                  }
                }}>
                Xác nhận
              </span>
            </div>
          )}
        </>
      );
    } else if (+paymentForm.payment_type === paymentFormType.POS) {
    return (
      <>
        <div className='bw_col_3'>
          <FormNumberFormat
            addonAfter='đ'
            field={`data_payment.${index}.payment_value`}
            disabled={watch('payment_status') === paymentStatus.PAID || watch('finance_company_confirmed') === 1}
            bordered
            controls={false}
            formatter={(value) => formatPrice(Math.round(value), false, ',')}
            onChange={(value) => {
              // debounceHandleChangeMoneyPayment(index, value);
            }}
            onBlur={(event) => {
              const paymentValue = parseInt(`${event?.target?.value}`?.replaceAll(',', '') || 0);
              handleChangeMoneyPayment(index, paymentValue);
            }}
          />
        </div>

        {paymentForm.payment_value > 0 && (
          <div className='bw_col_3 bw_flex bw_align_items_center'>
            <span
              class='bw_label_outline bw_label_outline_success text-center'
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (paymentForm.payment_value > 0) {
                  onConfirmPartnerPayment(paymentForm);
                }
              }}>
              Xác nhận
            </span>
          </div>
        )}
      </>
    );
  }
  };

  return (
    <React.Fragment>
      <div className='bw_row '>
        <div className='bw_col_12 bw_collapse_title'>
          <h3>Hình thức thanh toán</h3>
        </div>
      </div>

      {!!(
        watch('order_type') === orderType.INSTALLMENT_OFFLINE || watch('order_type') === orderType.INSTALLMENT_OFFLINE
      ) && (
          <div className='bw_row'>
            <div className='bw_col_6'>
              <InstallmentPayment>
                <img
                  alt='logo'
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '6px',
                    marginRight: '3px',
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                  src={`${BASE_URL ?? ''}${watch('installment_partner_logo')}`}></img>
                <p>{watch('installment_form_name')}</p>
              </InstallmentPayment>
            </div>
            {watch('installment_type') === 1 && (
              <div className='bw_col_6'>
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'right',
                    alignItems: 'center',
                  }}>
                  <BWButton
                    disabled={watch('payment_status') === paymentStatus.PAID || watch('finance_company_confirmed') === 1}
                    content='Thanh toán'
                    onClick={() => {
                      if (watch('total_a_mount') <= 0) {
                        showToast.error('Số tiền còn lại cần thanh toán trả góp phải lớn hơn 0');
                      } else {
                        setOpenModalPayment(true);
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

      {watch('data_payment') && watch('data_payment').length
        ? watch('data_payment').map((_item, idx) => (
          <div className='bw_row bw_mt_2' key={`payment-${idx}`}>
            <div className='bw_col_4'>
              <div className='bw_row bw_flex bw_align_items_center'>
                <div className='bw_col_12'>{_item.payment_form_name}</div>
              </div>
            </div>
            {paymentStatusRender(_item, idx)}
          </div>
        ))
        : null}

      {openModalPayment ? (
        <InstallmentPaymentModal
          onClose={() => {
            setOpenModalPayment(false);
          }}
          amount={watch('total_a_mount')}
          orderCode={watch('order_no')}
        />
      ) : null}
      {openResultModal ? (
        <PaymentResultModal
          onClose={() => {
            setOpenResultModal(false);
          }}
          paymentData={queryParams}
        />
      ) : null}
    </React.Fragment>
  );
};

export default PaymentForm;
