import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWAccordion from 'components/shared/BWAccordion';
import { useFormContext } from 'react-hook-form';
import {
  ACCOUNTING_OPTIONS,
  ACCOUNTING_TYPE,
  PURCHASE_REQUISITION_TYPE_PERMISSION,
} from 'pages/PurchaseRequisitionType/utils/constants';
import useGetOptions, { optionType } from 'hooks/useGetOptions';

const AccountingForm = ({ disabled, title }) => {
  const { watch, setValue } = useFormContext();
  const accountingAccountOptions = useGetOptions(optionType.accountingAccount, { labelName: 'code' });
  const accountingList = watch('accounting_list') ?? [];

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (d, index) => index + 1,
      },
      {
        header: 'Loại chứng từ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (item, index) => {
          return <FormSelect field={`accounting_list.${index}.type_accounting`} list={ACCOUNTING_TYPE} />;
        },
      },
      {
        header: 'Tính chất',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (d, index) => {
          return <FormSelect field={`accounting_list.${index}.accounting_option`} list={ACCOUNTING_OPTIONS} />;
        },
      },
      {
        header: 'TK',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (d, index) => {
          return (
            <FormSelect field={`accounting_list.${index}.accounting_account_id`} list={accountingAccountOptions} />
          );
        },
      },
    ],
    [disabled, accountingAccountOptions],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm dòng',
        permission: PURCHASE_REQUISITION_TYPE_PERMISSION.ADD_ACCOUNTING,
        onClick: () => {
          setValue('accounting_list', [{}, ...accountingList]);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        title: 'Xóa',
        permission: PURCHASE_REQUISITION_TYPE_PERMISSION.DEL_ACCOUNTING,
        onClick: (_, index) => {
          const accounting_list = watch('accounting_list') ?? [];
          setValue(
            'accounting_list',
            accounting_list.filter((_, idx) => idx !== index),
          );
        },
      },
    ];
  }, [accountingList]);

  return (
    <BWAccordion title={title}>
      <DataTable noSelect={true} noPaging={true} columns={columns} actions={actions} data={accountingList} />
    </BWAccordion>
  );
};

export default AccountingForm;
