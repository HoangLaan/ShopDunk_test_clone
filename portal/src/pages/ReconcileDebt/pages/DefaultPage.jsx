import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';

import { loadData, execute } from 'services/reconcile-debt.service';
import ReconcileFilter from '../components/FormSection/Infomation';

import { showToast } from 'utils/helpers';
import { DefaultValue, SUBMIT_TYPE } from '../utils/constant';
import VoucherPaymentList from '../components/FormSection/VoucherPaymentList';
import VoucherDebtList from '../components/FormSection/VoucherDebtList';
import ConfirmReconcile from '../components/Popup/ConfirmReconcile';

const ReconcileDebtAdd = () => {
  const methods = useForm({
    defaultValues: DefaultValue,
  });
  const [showConfirm, setShowConfirm] = useState(false);

  const loadInitData = useCallback(
    (payload) => {
      loadData({
        currency_type: payload.currency_type,
        selected_date: payload.selected_date,
        supplier_id: payload.supplier_id,
        account_id: payload.account_id,
      }).then((data) => {
        methods.setValue('voucher_payment_list', data?.voucher_payment_list || []);
        methods.setValue('voucher_debt_list', data?.voucher_debt_list || []);
      });
    },
    [methods],
  );

  const onSubmit = async (payload) => {
    try {
      if (payload.submit_type === SUBMIT_TYPE.FILTER) {
        loadInitData(payload);
      } else if (payload.submit_type === SUBMIT_TYPE.EXECUTE) {
        const selectedPaymentVoucher = methods.watch('selected_voucher_payment');
        const selectedDebtVoucher = methods.watch('selected_voucher_debt');
        if (
          selectedPaymentVoucher &&
          Object.keys(selectedPaymentVoucher)?.length > 0 &&
          selectedDebtVoucher?.length > 0
        ) {
          const voucherDebtList = selectedDebtVoucher
            ?.map((_voucher) => {
              const originInvoice = payload.voucher_debt_list?.find(
                (_originInvoice) => _originInvoice.invoice_id === _voucher.invoice_id,
              );
              return {
                ..._voucher,
                execute_change_money: originInvoice?.execute_change_money || 0,
              };
            })
            .filter((debt) => debt.execute_change_money > 0);

          const totalMoney = voucherDebtList.reduce((acc, voucher) => acc + voucher.execute_change_money, 0);

          if (totalMoney > 0 && totalMoney <= selectedPaymentVoucher.execute_change_money) {
            const payloadData = {
              supplier_id: payload.supplier_id,
              currency_type: payload.currency_type,
              account_id: payload.account_id,
              reconcile_date: payload.selected_date,
              voucher: {
                voucher_id: selectedPaymentVoucher.voucher_id,
                voucher_type: selectedPaymentVoucher.voucher_type,
                execute_change_money: selectedPaymentVoucher.execute_change_money,
              },
              invoice_list: voucherDebtList.map((_voucher) => ({
                purchase_order_id: _voucher.purchase_order_id,
                invoice_id: _voucher.invoice_id,
                voucher_type: _voucher.voucher_type,
                remaining_money: _voucher.remaining_money,
                execute_change_money: _voucher.execute_change_money,
              })),
            };

            execute(payloadData)
              .then((data) => {
                loadInitData(payload);
                methods.setValue('selected_voucher_payment', null);
                methods.setValue('selected_voucher_debt', []);
                detailForm.forEach(e => {
                  document.getElementById(`data-table-select-${e.id}`)?.click();
                })
                setShowConfirm(true);
              })
              .catch((err) => {
                showToast.error(err?.message || 'Thực hiện đối trừ xảy ra lỗi !');
              });
          } else {
            showToast.warning('Số tiền đối trừ không hợp lệ !');
          }
        } else {
          showToast.warning('Vui lòng chọn chứng từ công nợ và chứng từ thanh toán để đối trừ !');
        }
      }
    } catch (error) {
      showToast.error(error?.message || 'Có lỗi xảy ra!');
    }
  };

  const detailForm = useMemo(() => [
    {
      title: 'Đối tượng',
      id: 'object_id',
      component: ReconcileFilter,
      fieldActive: ['installment_form_name', 'installment_form_code'],
    }, //ok
    {
      title: 'Chứng từ thanh toán',
      id: 'payment_id',
      component: VoucherPaymentList,
      fieldActive: false,
    }, // ok
    {
      title: 'Chứng từ công nợ',
      id: 'debt_id',
      component: VoucherDebtList,
      fieldActive: false,
    },
  ], []);

  const actions = [
    {
      icon: 'fi fi-rr-check',
      submit: false,
      content: 'Đối trừ',
      className: 'bw_btn bw_btn_success',
      onClick: (e) => {
        methods.setValue('submit_type', SUBMIT_TYPE.EXECUTE);
        methods.handleSubmit(onSubmit)(e);
      },
    },
  ];


  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <FormSection actions={actions} noClose noSideBar detailForm={detailForm} onSubmit={onSubmit} disabled={false} />
      </FormProvider>
      {showConfirm && (
        <ConfirmReconcile
          onClose={() => {
            setShowConfirm(false);
          }}
        />
      )}
    </React.Fragment>
  );
};

export default ReconcileDebtAdd;
