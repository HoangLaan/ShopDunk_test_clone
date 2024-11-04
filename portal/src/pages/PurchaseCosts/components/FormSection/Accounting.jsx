import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/tableChange';

import FormItem from 'components/shared/BWFormControl/FormItem';
import { useFormContext, useFieldArray } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { getCreditAccountOpts, getDeptAccountOpts } from 'services/receive-slip.service';
import { RECEIVE_PAYMENT_TYPE } from 'pages/ReceivePaymentSlipCash/utils/constants';
import utilVar from '../../helpers/index';
import { optionAccounting, defendKeyAccountCheck } from '../../utils/constants';
import { DEFMATHTOTALACCOUNT } from '../../utils/constants';
import { setValueWatchByIndex, handleChangePriceOrVat, handleChangePurchaseAccount } from './mathPurchaseCost';
import { formatQuantity } from 'utils/number';
import { getExpendTypeOptions } from 'services/expend-type.service';

const Accounting = ({ title, disabled, type }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const [deptAccountingAccountOpts, setDeptAccountingAccountOpts] = useState([]);
  const [creditAccountingAccountOpts, setCreditAccountingAccountOpts] = useState([]);
  const [optionsCostType, setOptionsCostType] = useState([]);

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'accounting_list',
  });

  useEffect(() => {
    getDeptAccountOpts().then(setDeptAccountingAccountOpts);
    getCreditAccountOpts().then(setCreditAccountingAccountOpts);
    getExpendTypeOptions().then((data) => {
      if (data) {
        let dataParse = mapDataOptions4SelectCustom(data, 'value', 'title');
        setOptionsCostType(dataParse);
      }
    });
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
          debt_account: null,
          credit_account: creditAccountingAccountOpts?.find((_) => _.name === '1111')?.id || null,
          money: 0,
        });
      }
    }
  }, [deptAccountingAccountOpts, creditAccountingAccountOpts]);

  function updateTotalMoney() {
    const accountingList = methods.getValues('accounting_list') || [];
    const totalMoney = accountingList.reduce((total, accounting) => total + Number(accounting.money), 0);
    methods.setValue('total_money', totalMoney);
  }

  const handleAdd = useCallback(() => {
    let cloneDefendKeyAccountCheck = structuredClone(defendKeyAccountCheck);
    for (let element of methods.watch('accounting_list') || []) {
      for (let k = 0; k < cloneDefendKeyAccountCheck.length; k++) {
        if (!element[cloneDefendKeyAccountCheck[k]]) {
          showToast.error('Vui lòng nhập đầy đủ thông tin, trước khi thêm dòng mới !');
          return;
        }
      }
    }
    const descriptions = methods.getValues('descriptions');
    append({
      explain: descriptions ?? '',
      debt_account: null,
      credit_account: null,
      money: 0,
      tax_account: creditAccountingAccountOpts.find(item => item.name === '1331')?.id
    });
  }, [append, methods]);

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Loại chi phí',
      classNameHeader: 'bw_text_center',
      style: { minWidth: '120px' },
      disabled: disabled,
      formatter: (_, index) => (
        <FormSelect
          disabled={disabled}
          list={optionsCostType}
          field={`accounting_list.${index}.cost_type_id`}
          validation={{
            required: 'Loại chi phí là bắt buộc',
          }}
        />
      ),
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
      style: { minWidth: '70px' },
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
      style: { minWidth: '70px' },
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
      header: 'Đơn giá',
      styleHeader: { textAlign: 'right' },
      classNameHeader: 'bw_text_right',
      disabled: disabled,
      formatter: (_, index) => (
        <FormNumber
          bordered
          type='text'
          style={{ padding: '2px 16px' }}
          className='bw_inp bw_input_right'
          disabled={disabled}
          field={`accounting_list.${index}.cost_money`}
          onChange={(value) => {
            const DEF = Math.pow(10, 10);
            const valueCheck = utilVar.checkBetweenValue(0, DEF, value);
            setValueWatchByIndex(methods, index, 'cost_money', valueCheck, 'accounting_list');
            handleChangePriceOrVat(methods, index, valueCheck, null);
          }}
          validation={{
            required: 'Số tiền là bắt buộc',
            min: { value: 0, message: 'Số tiền phải lớn hơn không !' },
          }}
        />
      ),
    },
    {
      header: 'VAT',
      classNameHeader: 'bw_text_center',
      disabled: disabled,
      formatter: (_, index) => (
        <FormNumber
          bordered
          type='text'
          style={{ padding: '2px 0', maxWidth: '60px' }}
          // className='bw_inp'
          disabled={disabled}
          field={`accounting_list.${index}.vat_money`}
          onChange={(value) => {
            const DEF = Math.pow(10, 2);
            const valueCheck = utilVar.checkBetweenValue(0, DEF, value);
            setValueWatchByIndex(methods, index, 'vat_money', valueCheck, 'accounting_list');
            handleChangePriceOrVat(methods, index, null, valueCheck);
          }}
        />
      ),
    },
    {
      header: 'Thành tiền VAT',
      classNameHeader: 'bw_text_center',
      disabled: disabled,
      formatter: (_, index) => (
        <FormNumber
          bordered
          type='text'
          style={{ padding: '2px 16px' }}
          className='bw_inp bw_input_right'
          disabled={true}
          field={`accounting_list.${index}.return_vat_money`}
          validation={{
            min: { value: 0, message: 'Số tiền phải lớn hơn không !' },
          }}
        />
      ),
    },
    {
      header: 'TK Thuế',
      classNameHeader: 'bw_text_center',
      disabled: disabled,
      formatter: (_, index) => (
        <FormSelect
          bordered
          disabled={disabled}
          field={`accounting_list.${index}.tax_account`}
          list={mapDataOptions4SelectCustom(creditAccountingAccountOpts)}
          validation={{
            required: 'Tài khoản có là bắt buộc !',
          }}
        />
      ),
    },
    {
      header: 'Thành tiền',
      styleHeader: { textAlign: 'right' },
      disabled: disabled,
      formatter: (_, index) => (
        <FormNumber
          bordered
          type='text'
          style={{ padding: '2px 16px' }}
          className='bw_inp bw_input_right'
          disabled={true}
          field={`accounting_list.${index}.money`}
          validation={{
            min: { value: 0, message: 'Số tiền phải lớn hơn không !' },
          }}
        />
      ),
    },
    {
      header: 'Mô tả',
      classNameHeader: 'bw_text_center',
      disabled: disabled,
      formatter: (_, index) => (
        <FormInput
          bordered
          className='bw_inp'
          type='text'
          disabled={disabled}
          field={`accounting_list.${index}.description`}
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

  const defendTfoot = () => {
    return (
      <tfoot>
        <tr>
          <th colSpan='7'>Tổng cộng</th>
          <th className='bw_text_right bw_th_border'>
            {formatQuantity(methods.watch(`${DEFMATHTOTALACCOUNT}_return_vat_money`))}
          </th>
          <th className='bw_th_border' colSpan='1'></th>
          <th className='bw_text_right bw_th_border'>
            {formatQuantity(methods.watch(`${DEFMATHTOTALACCOUNT}_money`))}
          </th>
          <th className='bw_th_border' colSpan='2'></th>
        </tr>
      </tfoot>
    );
  };

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <FormItem className='bw_col_6' label='Phân bổ CP mua hàng' disabled={disabled} isRequired>
          <FormSelect
            disabled={disabled}
            field='purchase_cost_account_id'
            list={optionAccounting}
            onChange={(e, opts) => {
              handleChangePurchaseAccount(methods, e);
            }}
            validation={{
              required: 'Phân bổ theo số lượng là bắt buộc',
            }}
          />
        </FormItem>
        <DataTable
          noSelect
          noPaging
          columns={columns}
          actions={actions}
          data={fields}
          defendTfoot
          showTfoot={true}
          contentTfoot={defendTfoot}
        />
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
