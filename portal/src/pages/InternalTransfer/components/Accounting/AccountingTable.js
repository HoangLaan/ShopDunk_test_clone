import DataTable from 'components/shared/DataTable/index';
import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import BWAccordion from 'components/shared/BWAccordion';
import { CURRENCY_TYPE } from 'pages/InternalTransfer/helpers/const';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { mapDataOptions4Select, mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { formatPrice } from 'utils';

const AccountingTable = ({ disabled, title }) => {
  const { watch, setValue, reset, getValues, clearErrors, control } = useFormContext();
  const currentLabelMoney = CURRENCY_TYPE.find((item) => item.value === watch('currency_type'))?.label ?? '';
  const accountingAccountOptions = useGetOptions(optionType.accountingAccount, { labelName: 'code' });
  const defaultAccountingAccountCode = watch('payment_type') === 2 ? '1121' : '1111';
  const [accountIdDefault, setAccountIdDefault] = useState();
  const is_same_business = watch('is_same_business');

  useEffect(() => {
    if (accountingAccountOptions.length > 0) {
      setAccountIdDefault(accountingAccountOptions.find((item) => item.code === defaultAccountingAccountCode)?.id);
    }
  }, [accountingAccountOptions, defaultAccountingAccountCode]);

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'accounting_list',
  });

  useEffect(() => {
    if (!accountIdDefault) return () => {};
    if (fields.length > 0) {
      setValue(
        'accounting_list',
        watch('accounting_list')?.map((item) => {
          return {
            ...item,
            debt_account_id: accountIdDefault,
            credit_account_id: accountIdDefault,
          };
        }),
      );
    }
  }, [accountIdDefault]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Nội dung hạng mục',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => (
          <FormInput
            bordered
            className='bw_inp'
            type='text'
            disabled={disabled}
            field={`accounting_list.${index}.explain`}
            validation={{
              required: 'Nội dung hạng mục là bắt buộc',
            }}
          />
        ),
      },
      {
        header: 'TK Nợ',
        classNameHeader: 'bw_text_center',
        disabled: disabled,
        hidden: !is_same_business,
        formatter: (_, index) => (
          <FormSelect
            bordered
            disabled={true}
            field={`accounting_list.${index}.debt_account_id`}
            list={accountingAccountOptions}
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
        hidden: !is_same_business,
        formatter: (_, index) => (
          <FormSelect
            bordered
            disabled={true}
            field={`accounting_list.${index}.credit_account_id`}
            list={accountingAccountOptions}
            validation={{
              required: 'Tài khoản có là bắt buộc !',
            }}
          />
        ),
      },
      {
        header: `Số tiền (${currentLabelMoney})`,
        classNameHeader: 'bw_text_center',
        disabled: disabled,
        style: { width: '200px' },
        formatter: (_, index) => (
          <FormNumber
            bordered
            type='text'
            className='bw_inp'
            disabled={disabled}
            field={`accounting_list.${index}.money`}
            onChange={(value) => {
              const fieldName = `accounting_list.${index}.money`;
              clearErrors(fieldName);
              setValue(fieldName, value);
            }}
            validation={{
              required: 'Số tiền là bắt buộc',
              min: { value: 1, message: 'Số tiền phải lớn hơn không !' },
            }}
          />
        ),
      },
    ],
    [currentLabelMoney, accountingAccountOptions, is_same_business],
  );

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        hidden: disabled,
        permission: 'SL_INTERNALTRANSFER_ACCOUNTING_ADD',
        onClick: () => {
          for (const item of watch('accounting_list') ?? []) {
            if (Object.values(item).some((value) => !value && value !== 0)) {
              return showToast.error('Vui lòng nhập đầy đủ thông tin, trước khi thêm dòng mới !');
            }
          }
          append({
            explain: '',
            debt_account_id: accountIdDefault,
            credit_account_id: accountIdDefault,
          });
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: disabled,
        permission: 'SL_INTERNALTRANSFER_ACCOUNTING_DEL',
        onClick: (_, index) => remove(index),
      },
    ],
    [accountIdDefault, disabled],
  );

  return (
    <>
      <BWAccordion title={title} isRequired>
        <DataTable
          noPaging
          noSelect
          columns={columns}
          data={fields}
          actions={actions}
          customSumRow={[
            {
              index: 1,
              value: 'Tổng số tiền Chi / Thu: ',
              colSpan: is_same_business ? 4 : 2,
              style: {
                textAlign: 'center',
              },
            },
            {
              index: is_same_business ? 5 : 3,
              formatter: () => {
                return formatPrice(
                  watch('accounting_list')?.reduce((acc, item) => acc + (item.money ?? 0), 0),
                  false,
                  ',',
                );
              },
            },
          ]}
        />
      </BWAccordion>
    </>
  );
};

export default AccountingTable;
