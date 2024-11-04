import React, { useCallback, useEffect, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import { useFormContext } from 'react-hook-form';
import DataTable from 'components/shared/DataTable';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { formatMoney } from 'utils';
import { VOUCHER_DEBT_TYPE } from 'pages/ReconcileDebt/utils/constant';
import { showToast } from 'utils/helpers';

const FIELD_NAME = 'voucher_debt_list';

const InstallmentPeriod = ({ disabled, title, id, resetSelected }) => {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const [data, setData] = useState([]);
  const [showNoti, setShowNoti] = useState(false)
  // hanlde reconcile debt
  useEffect(() => {
    const subscription = watch((value) => {
      handleChangeWatch(value)
    })
    showNoti && showToast.warning('Số tiền đối trừ phải lớn hơn 0');
    return () => subscription.unsubscribe()
  }, [showNoti, watch]);

  const handleChangeWatch = useCallback((value) => {
    const selectedPaymentVoucher = value['selected_voucher_payment'];
    const selectedDebtVoucher = value['selected_voucher_debt'];
    setData(value[FIELD_NAME]);
    const dataVoucherPaymentList = value[['voucher_payment_list']]
    const voucherDebtList = value[FIELD_NAME];

    if (dataVoucherPaymentList && dataVoucherPaymentList.length && selectedPaymentVoucher) {
      const findData = dataVoucherPaymentList?.find(i => i.voucher_id === selectedPaymentVoucher.voucher_id)
      if (findData) {
        if (selectedDebtVoucher && selectedDebtVoucher?.length > 0 && selectedPaymentVoucher && voucherDebtList) {
          const totalMomney = findData.execute_change_money;
          if (totalMomney > 0) {
            setShowNoti(false)

            let isChange = false;
            let remainingMoney = totalMomney;

            selectedDebtVoucher.forEach((invoice) => {
              const debtMoney = invoice.remaining_money;
              const changeMoney = remainingMoney - debtMoney > 0 ? debtMoney : remainingMoney;
              remainingMoney = remainingMoney > debtMoney ? remainingMoney - debtMoney : 0;
              invoice.execute_change_money = changeMoney;

              // change money in state
              voucherDebtList?.forEach((_invoice) => {
                if (_invoice.invoice_no === invoice.invoice_no) {
                  if (_invoice.execute_change_money !== changeMoney) {
                    _invoice.execute_change_money = changeMoney;
                    isChange = true;
                  }
                } else if (!selectedDebtVoucher.some((_voucher) => _voucher.invoice_no === _invoice.invoice_no)) {
                  if (_invoice.execute_change_money !== 0) {
                    _invoice.execute_change_money = 0;
                    isChange = true;
                  }
                }
              });

            });
            if (isChange) {
              setValue(FIELD_NAME, voucherDebtList);
            }
          } else {
            setShowNoti(true)
            // showToast.warning('Số tiền đối trừ phải lớn hơn 0');
          }
        } else {
          let isChange = false;

          voucherDebtList?.forEach((_invoice) => {
            if (_invoice.execute_change_money !== 0) {
              _invoice.execute_change_money = 0;
              isChange = true;
            }
          });
          if (isChange) {
            setValue(FIELD_NAME, voucherDebtList);
          }
        }
      }
    }
  }, [])

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
      accessor: 'invoice_date',
    },
    {
      header: 'Số chứng từ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'purchase_order_code',
    },
    {
      header: 'Số hóa đơn',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'invoice_no',
    },
    {
      header: 'Hạn thanh toán',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'payment_expire_date',
    },
    {
      header: 'Diễn giải',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      accessor: 'invoice_note',
    },
    {
      header: 'Số tiền',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (item, index) => {
        return formatMoney(item.sum_final_money);
      },
    },
    {
      header: 'Số còn nợ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (item, index) => {
        return formatMoney(item.remaining_money);
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
        const maxValue = getMaxVal(index, `remaining_money`);
        // const maxValue = watch(`${FIELD_NAME}.${index}.remaining_money`);

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
              methods.setValue(field, changeValue);
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
          case VOUCHER_DEBT_TYPE.PURCHASEORDER:
            return 'Đơn mua hàng';
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
            fieldCheck={'invoice_no'}
            onChangeSelect={(selectedData) => {
              setValue('selected_voucher_debt', selectedData || []);
            }}
            noPaging
            ownId={id}
            hiddenDeleteClick
            columns={columns}
            data={data}
          />
        </div>
      </div>
    </BWAccordion>
  );
};

export default InstallmentPeriod;
