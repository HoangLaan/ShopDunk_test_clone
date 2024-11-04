import BWButton from 'components/shared/BWButton';
import React, { useEffect, useState, useCallback } from 'react';
import { formatPrice } from 'utils/index';
import { formatQuantity } from 'utils/number';
import lodash from 'lodash';

const PayDebitSummary = ({ statistic, data }) => {
  const [total_money, setTotalMoney] = useState(0);
  const [total_money_pay, setTotalMoneyPay] = useState(0);
  const [total_money_receivable, setTotalMoneyReceivable] = useState(0);

  const bw_count_cus_style = {
    paddingLeft: '10px',
  };

  const loadSumary = useCallback(() => {
    let { total_money = 0, total_money_pay = 0, total_money_receivable = 0 } = statistic || {};
    setTotalMoney(total_money);
    setTotalMoneyPay(total_money_pay);
    setTotalMoneyReceivable(total_money_receivable);
  }, [statistic]);

  useEffect(loadSumary, [loadSumary]);

  const calTotal = (field) => data.reduce((acc, cur) => (acc += cur[field]), 0);
  const totalMoney = formatQuantity(calTotal('total_money'));
  const totalAmount = formatQuantity(calTotal('total_amount'));

  const totalPurchase = (data) => {
    const purchaseOrderIds = [];

    const sum = data.reduce((acc, p) => {
      let value = 0;

      if (p.purchase_order_invoice_id && !purchaseOrderIds.includes(p.purchase_order_invoice_id)) {
        purchaseOrderIds.push(p.purchase_order_invoice_id);
        value = Number(p.purchase_order_total_money || 0);
      } else if (p.purchase_order_id && !purchaseOrderIds.includes(p.purchase_order_id)) {
        purchaseOrderIds.push(p.purchase_order_id);
        value = Number(p.total_money || 0);
      }

      return acc + value;
    }, 0);

    return formatQuantity(sum);
  };

  return (
    <div className='bw_row bw_mb_2 bw_align_items_center'>
      <div className='bw_col_8 bw_flex bw_align_items_center'>
        <div className='bw_count_cus'>
          Số tiền cần trả theo số phiếu:<b className='bw_blue'>{formatQuantity(statistic.total_purchase_money)} đ</b>
        </div>
        <div className='bw_count_cus'>
          Số tiền cần trả theo hóa đơn:<b className='bw_blue'>{formatQuantity(statistic.total_money)} đ</b>
        </div>
        <div className='bw_count_cus'>
          Công nợ:<b className='bw_red'>{formatQuantity(statistic.total_amount)} đ</b>
        </div>
      </div>
    </div>
  );
};

export default PayDebitSummary;
