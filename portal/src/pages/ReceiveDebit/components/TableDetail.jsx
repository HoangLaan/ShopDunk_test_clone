import React, { useCallback, useEffect } from 'react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import DataTable from 'components/shared/DataTable/index';
import { PERMISSIONS } from '../utils/permission';
import { formatPrice } from 'utils';

const OtherVoucherTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  handleExportExcel,
  sumRecord,
}) => {
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        header: 'Ngày hạch toán',
        classNameHeader: 'bw_text_center',
        accessor: 'accounting_date',
      },
      {
        header: 'Ngày chứng từ',
        classNameHeader: 'bw_text_center',
        accessor: 'voucher_date',
      },
      {
        header: 'Số chứng từ',
        classNameHeader: 'bw_text_center',
        accessor: 'voucher_code',
        formatter: (item) => {
          return (
            <div
              onClick={() => {
                let href = '';
                if (item.order_id) {
                  href = `/orders/detail/${item.order_id}?tab_active=information`;
                } else if (item.receive_slip_id) {
                  if (item.voucher_code?.includes('UN')) {
                    href = `/receive-payment-slip-credit/detail/${item.receive_slip_id}_1`;
                  } else {
                    href = `/receive-payment-slip-cash/detail/${item.receive_slip_id}_1`;
                  }
                } else if (item.payment_slip_id) {
                  if (item.voucher_code?.includes('UN')) {
                    href = `/receive-payment-slip-credit/detail/${item.payment_slip_id}_2`;
                  } else {
                    href = `/receive-payment-slip-cash/detail/${item.payment_slip_id}_2`;
                  }
                } else if (item.other_acc_voucher_id) {
                  href = `/other-voucher/detail/${item.other_acc_voucher_id}?tab_active=accountings`;
                } else if (item.purchase_order_id) {
                  href = `/purchase-orders/detail/${item.purchase_order_id}?tab_active=invoice`;
                } else if (item.purchase_cost_id) {
                  href = `/purchase-cost/detail/${item.purchase_cost_id}`;
                }
                if (href) {
                  window.open(href, '_blank', 'rel=noopener noreferrer');
                }
              }}
              style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}>
              {item.voucher_code}
            </div>
          );
        },
      },
      {
        header: 'Mã khách hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'customer_code',
      },
      {
        header: 'Tên khách hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'customer_name',
      },
      {
        header: 'Diễn giải',
        classNameHeader: 'bw_text_center',
        accessor: 'explain',
      },
      {
        header: 'TK Công nợ',
        classNameHeader: 'bw_text_center',
        accessor: 'main_acc_code',
      },
      {
        header: 'TK đối ứng',
        classNameHeader: 'bw_text_center',
        accessor: 'sub_acc_code',
        formatter: (item) => {
          return (
            <div>
              <span>{item.sub_acc_code}</span>
              {!!item.tax_acc_code && <span>{`, ${item.tax_acc_code}`}</span>}
            </div>
          );
        },
      },
      {
        header: 'Tài khoản ngân hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'bank_account',
      },
      {
        header: 'Hình thức thanh toán',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'payment_form_name',
      },
      {
        header: 'Dư nợ đầu kỳ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'total_money',
        formatter: (item) => formatPrice(item?.debt_begin_money || 0, false, ','),
      },
      {
        header: 'Dư có đầu kỳ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'total_money', 
        formatter: (item) => formatPrice(item?.credit_begin_money || 0, false, ','),
      },
      {
        header: 'Phát sinh Nợ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'total_money',
        formatter: (item) => formatPrice(item?.debt_arise_money || 0, false, ','),
      },
      {
        header: 'Phát sinh Có',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'total_money',
        formatter: (item) => formatPrice(item?.credit_arise_money || 0, false, ','),
      },
      {
        header: 'Dư Nợ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (item, index) =>
          item?.remaining + (index ? sumRecord?.credit_begin - sumRecord?.debt_begin : 0) < 0
            ? formatPrice(
                (item?.remaining + (index ? sumRecord?.credit_begin - sumRecord?.debt_begin : 0)) * -1 || 0,
                false,
                ',',
              )
            : 0,
      },
      {
        header: 'Dư Có',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'total_money',
        formatter: (item, index) =>
          item?.remaining + (index ? sumRecord?.credit_begin - sumRecord?.debt_begin : 0) > 0
            ? formatPrice(
                item?.remaining + (index ? sumRecord?.credit_begin - sumRecord?.debt_begin : 0) || 0,
                false,
                ',',
              )
            : 0,
      },
    ],
    [sumRecord],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out',
        style: { margin: 0, marginRight: '10px' },
        type: 'warning',
        content: 'Xuất Excel',
        permission: PERMISSIONS.AC_RECEIVABLE_EXPORT,
        onClick: handleExportExcel,
      },
    ];
  }, [dispatch, handleExportExcel]);

  return (
    <DataTable
      noSelect
      loading={loading}
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      customSumRow={[
        {
          index: 4,
          value: 'Tổng cộng',
          colSpan: 2,
          style: {
            textAlign: 'center',
          },
        },
        {
          index: 13,
          value: formatPrice(Math.round(sumRecord.total_debt_arise), false, ','),
          style: {
            textAlign: 'right',
          },
        },
        {
          index: 14,
          value: formatPrice(Math.round(sumRecord.total_credit_arise), false, ','),
          style: {
            textAlign: 'right',
          },
        },
      ]}
    />
  );
};

export default OtherVoucherTable;
