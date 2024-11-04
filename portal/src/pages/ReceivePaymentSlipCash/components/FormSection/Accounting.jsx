import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable';

import { useFormContext, useFieldArray } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { getCreditAccountOpts, getDeptAccountOpts } from 'services/receive-slip.service';
import { ACCURACY_TYPE, RECEIVE_PAYMENT_TYPE } from 'pages/ReceivePaymentSlipCash/utils/constants';
import styled from 'styled-components';
import { useAuth } from 'context/AuthProvider';
import useVerifyAccess from 'hooks/useVerifyAccess';

const FormNumberCustom = styled(FormNumber)`
  .ant-input-number-input {
    text-align: right;
  }
`;

const Accounting = ({ title, disabled, type, isAddPage }) => {
  const { user } = useAuth();
  const { verifyPermission } = useVerifyAccess();

  const userAuth = useMemo(() => {
    return {
      isAdmin: user?.isAdministrator,
      isHavePermissionToEdit: verifyPermission('SL_RECEIVE_PAYMENT_CASH_ACCOUNTING_EDIT'),
    };
  }, []);

  disabled = disabled || (!isAddPage && !(userAuth.isAdmin || userAuth.isHavePermissionToEdit));

  const dispatch = useDispatch();
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const [deptAccountingAccountOpts, setDeptAccountingAccountOpts] = useState([]);
  const [creditAccountingAccountOpts, setCreditAccountingAccountOpts] = useState([]);

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'accounting_list',
  });

  useEffect(() => {
    getDeptAccountOpts().then(setDeptAccountingAccountOpts);
    getCreditAccountOpts().then(setCreditAccountingAccountOpts);
  }, []);

  useEffect(() => {
    if (
      (!methods.getValues('accounting_list') || methods.getValues('accounting_list')?.length === 0) &&
      deptAccountingAccountOpts?.length > 0 &&
      creditAccountingAccountOpts?.length > 0
    ) {
      if (type === RECEIVE_PAYMENT_TYPE.RECEIVESLIP) {
        append({
          explain: methods.getValues('descriptions') ?? '',
          debt_account: deptAccountingAccountOpts?.find((_) => _.name === '1111')?.id || null,
          credit_account: null,
          money: 0,
        });
      }
      if (type === RECEIVE_PAYMENT_TYPE.PAYMENTSLIP) {
        append({
          explain: methods.getValues('descriptions') ?? '',
          debt_account: deptAccountingAccountOpts?.find((_) => _.name === '331')?.id || null,
          credit_account: creditAccountingAccountOpts?.find((_) => _.name === '1111')?.id || null,
          money: 0,
        });
      }
    }
  }, [deptAccountingAccountOpts, creditAccountingAccountOpts]);

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Diễn giải',
      classNameHeader: 'bw_text_center',
      disabled: disabled,
      formatter: (_, index) => (
        <FormInput
          bordered
          className='bw_inp'
          type='text'
          disabled={disabled}
          field={`accounting_list.${index}.explain`}
          validation={{
            required: 'Diễn giải là bắt buộc',
          }}
        />
      ),
    },
    {
      header: 'TK Nợ',
      classNameHeader: 'bw_text_center',
      disabled: disabled,
      formatter: (_, index) => (
        <FormSelect
          bordered
          disabled={disabled}
          field={`accounting_list.${index}.debt_account`}
          list={mapDataOptions4SelectCustom(deptAccountingAccountOpts)}
          validation={{
            required: 'Tài khoản nợ là bắt buộc !',
          }}
        />
      ),
    },
    {
      header: 'TK Có',
      classNameHeader: 'bw_text_center',
      disabled: disabled,
      formatter: (_, index) => (
        <FormSelect
          bordered
          disabled={disabled}
          field={`accounting_list.${index}.credit_account`}
          list={mapDataOptions4SelectCustom(creditAccountingAccountOpts)}
          validation={{
            required: 'Tài khoản có là bắt buộc !',
          }}
        />
      ),
    },
    {
      header: `Số tiền (${methods.watch('currency_type') == ACCURACY_TYPE.VND ? 'VND' : 'USD'})`,
      classNameHeader: 'bw_text_center',
      disabled: disabled,
      style: { width: '200px' },
      formatter: (_, index) => (
        <FormNumberCustom
          bordered
          type='text'
          style={{ padding: '2px 16px', width: '100%' }}
          className='bw_inp'
          disabled={disabled || methods.watch('is_multiple_invoice')}
          field={`accounting_list.${index}.money`}
          onChange={(value) => {
            const fieldName = `accounting_list.${index}.money`;
            methods.clearErrors(fieldName);
            methods.setValue(fieldName, value);
            updateTotalMoney();
            updateMoneyInvoice();
          }}
          validation={{
            required: 'Số tiền là bắt buộc',
            min: { value: 1, message: 'Số tiền phải lớn hơn không !' },
          }}
        />
      ),
    },
  ];

  const actions = useMemo(() => [
    {
      icon: 'fi fi-rr-trash',
      color: 'red',
      disabled: disabled,
      permission: 'SL_RECEIVE_PAYMENT_CASH_EDIT',
      onClick: (_, index) => {
        if (!disabled) {
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                remove(index);
                updateTotalMoney();
              },
            ),
          );
        }
      },
    },
  ]);

  function updateTotalMoney() {
    const accountingList = methods.getValues('accounting_list') || [];
    const totalMoney = accountingList.reduce((total, accounting) => total + Number(accounting.money), 0);
    methods.setValue('total_money', totalMoney);
  }

  function updateMoneyInvoice() {
    const accountingList = watch('accounting_list') ?? [];
    let totalMoney = accountingList.reduce((total, accounting) => total + Number(accounting.money), 0);
    const invoice_list = watch('invoice_payment_list') ?? [];
    for (const index in invoice_list) {
      let paymentPrice = invoice_list[index].total_payment_price;
      if (totalMoney > paymentPrice) {
        invoice_list[index].remaining_price = paymentPrice;
        totalMoney -= paymentPrice;
      } else {
        invoice_list[index].remaining_price = totalMoney;
        totalMoney = 0;
      }
    }

    setValue('invoice_payment_list', invoice_list);
  }

  const handleAdd = useCallback(() => {
    for (let element of methods.watch('accounting_list') || []) {
      if (Object.values(element).some((value) => !value && value !== 0)) {
        showToast.error('Vui lòng nhập đầy đủ thông tin, trước khi thêm dòng mới !');
        return;
      }
    }
    const descriptions = methods.getValues('descriptions');
    append({
      explain: descriptions ?? '',
      debt_account: null,
      credit_account: null,
      money: 0,
    });
  }, [append, methods]);
  console.log("fields", fields);
  return (
    <BWAccordion title={title} isRequired={true}>
      <div className='bw_col_12'>
        <DataTable noSelect noPaging columns={columns} actions={actions} data={fields} />
        {!disabled && (
          <div onClick={handleAdd} className='bw_btn_outline bw_btn_outline_success bw_add_us'>
            <span className='fi fi-rr-plus'></span> Thêm dòng
          </div>
        )}
      </div>
    </BWAccordion>
  );
};

export default Accounting;
