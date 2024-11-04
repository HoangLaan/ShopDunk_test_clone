import React, { useCallback, useEffect, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import { useFormContext } from 'react-hook-form';
import DataTable from 'components/shared/DataTable';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { formatMoney } from 'utils';
import { VOUCHER_TYPE } from 'pages/ReconcileDebt/utils/constant';

const FIELD_NAME = 'voucher_payment_list';

const VoucherPayments = ({ disabled, title, id }) => {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const [data, setData] = useState([])
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      setData(value[FIELD_NAME]);
    })
    return () => subscription.unsubscribe()
  }, [watch]);

  const getMaxVal = useCallback((index, key) => {
    const row = data.at(index);
    if (!row) return 0;
    return row[key];
  }, [data])

  const columns = [
    {
      header: 'Ngày chứng từ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'accounting_date',
    },
    {
      header: 'Số chứng từ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'voucher_code',
    },
    {
      header: 'Diễn giải',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      accessor: 'descriptions',
    },
    {
      header: 'Số tiền',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (item, index) => {
        return formatMoney(item.total_money);
      },
    },
    {
      header: 'Số chưa đối trừ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (item, index) => {
        return formatMoney(item.change_money);
      },
    },
    {
      header: 'Số tiền đối trừ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'parent_name',
      formatter: (item, index) => {
        const field = `${FIELD_NAME}.${index}.execute_change_money`;
        const maxValue = getMaxVal(index, `change_money`);
        // const maxValue = watch(`${FIELD_NAME}.${index}.change_money`);

        return (
          <FormNumber
            bordered
            style={{ minWidth: '140px' }}
            disabled={disabled}
            field={field}
            value={item['execute_change_money']}
            addonAfter={'đ'}
            validation={{
              min: {
                value: 0,
                message: 'Giá trị phải lớn hơn 0',
              },
            }}
            onChange={(value) => {
              methods.clearErrors(field);

              let changeValue = 0;
              if (value > maxValue) {
                changeValue = maxValue;
              } else if (value > 0) {
                changeValue = value;
              } else {
                changeValue = 0;
              }

              setValue(field, changeValue);
            }}
          />
        );
      },
    },
    {
      header: 'Loại chứng từ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (item, index) => {
        switch (item.voucher_type) {
          case VOUCHER_TYPE.PAYMENTSLIP_CASH:
            return 'Phiếu chi';
          case VOUCHER_TYPE.PAYMENTSLIP_CREDIT:
            return 'Ủy nhiệm chi';
          case VOUCHER_TYPE.OTHER_VOUCHER:
            return 'Chứng từ khác';
          default:
            return 'Không xác định';
        }
      },
    },
  ];

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_12'>
          <DataTable
            uniqueSelect
            onChangeSelect={(dataSelect) => {
              const selectedVoucher = dataSelect?.[0] || null;
              setValue('selected_voucher_payment', selectedVoucher);
            }}
            ownId={id}
            noPaging
            hiddenDeleteClick
            columns={columns}
            data={data}
          />
        </div>
      </div>
    </BWAccordion>
  );
};

export default VoucherPayments;
