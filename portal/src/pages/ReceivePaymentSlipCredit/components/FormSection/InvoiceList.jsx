import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import DataTable from 'components/shared/DataTable';

import { useFormContext, useFieldArray } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import styled from 'styled-components';
import { formatQuantity } from 'utils/number';

const FormNumberCustom = styled(FormNumber)`
  .ant-input-number-input {
    text-align: right;
  }
`;

const InvoiceList = ({ title, disabled }) => {
  const methods = useFormContext();
  const { setValue, watch } = methods;

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'invoice_payment_list',
  });

  const invoice_options = methods.watch('invoice_options') || [];

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Ngày tạo',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      disabled: disabled,
      accessor: 'created_date',
    },
    {
      header: 'Mã hóa đơn',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      disabled: disabled,
      accessor: 'invoice_no',
    },
    {
      header: 'Tổng số tiền',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      disabled: disabled,
      formatter: (item) => <span>{formatQuantity(item.total_payment_price)}</span>,
    },
    {
      header: 'Số tiền thanh toán',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      disabled: disabled,
      formatter: (item) => <span>{formatQuantity(item.remaining_price)}</span>,
    },
  ];

  const handleSelectInvoice = useCallback(
    (value) => {
      if (value.includes(-1)) {
        setValue(
          'invoice_options',
          invoice_options.map((item) => ({ ...item, disabled: item.value === -1 ? true : false })),
        );
        setValue('invoice_ids', invoice_options);
        setValue(
          'invoice_payment_list',
          invoice_options.filter((item) => item.value !== -1),
        );
      } else {
        setValue('invoice_ids', value);
        setValue(
          'invoice_payment_list',
          invoice_options.filter((item) => value.includes(parseInt(item.invoice_id))),
        );
      }
    },
    [invoice_options],
  );

  return fields.length > 0 || invoice_options.length > 0 ? (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <FormItem label='Hóa đơn'>
          <FormSelect
            disabled={watch('is_disabled')}
            mode={'multiple'}
            field={'invoice_ids'}
            list={[{ value: -1, label: 'Tất cả' }, ...invoice_options]}
            onChange={handleSelectInvoice}
          />
        </FormItem>
        <DataTable noSelect noPaging columns={columns} data={fields} />
      </div>
    </BWAccordion>
  ) : null;
};

export default InvoiceList;
