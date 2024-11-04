import React, { useCallback } from 'react';
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
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
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
        header: 'TK Công nợ',
        classNameHeader: 'bw_text_center',
        accessor: 'accounting_account',
        formatter: () => 131,
      },
      {
        header: 'Số dư Nợ đầu kỳ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (item) => {
          // return formatPrice(item?.debt_begin_money || 0, false, ',');
          if (item?.debt_begin_money > item?.credit_begin_money)
            return formatPrice((item?.debt_begin_money || 0) - (item?.credit_begin_money || 0), false, ',');
          return 0;
        },
      },
      {
        header: 'Số dư Có đầu kỳ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (item) => {
          // return formatPrice(item?.credit_begin_money || 0, false, ',');
          if (item?.credit_begin_money > item?.debt_begin_money)
            return formatPrice((item?.credit_begin_money || 0) - (item?.debt_begin_money || 0), false, ',');
          return 0;
        },
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
        formatter: (item) => {
          const debtMoney = item?.debt_begin_money + item?.debt_arise_money;
          const creditMoney = item?.credit_begin_money + item?.credit_arise_money;
          const money = debtMoney - creditMoney || 0;

          return <span>{money >= 0 ? formatPrice(money, false, ',') : `0`}</span>;
        },
      },
      {
        header: 'Dư Có',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'total_money',
        formatter: (item) => {
          const debtMoney = item?.debt_begin_money + item?.debt_arise_money;
          const creditMoney = item?.credit_begin_money + item?.credit_arise_money;
          const money = creditMoney - debtMoney || 0;
          return <span>{money >= 0 ? formatPrice(money, false, ',') : `0`}</span>;
        },
      },
    ],
    [],
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
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: PERMISSIONS.AC_RECEIVABLE_VIEW,
        onClick: (p) => {
          window._$g.rdr(`/receive-debit/detail?customer_id=${p.customer_id}&customer_type=${p.customer_type}`);
        },
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
          index: 1,
          value: 'Tổng cộng',
          colSpan: 4,
          style: {
            textAlign: 'center',
          },
        },
        // {
        //   index: 5,
        //   value: formatPrice(sumRecord.total_debt_begin, false, ','),
        //   style: {
        //     textAlign: 'right',
        //   },
        // },
        // {
        //   index: 6,
        //   value: formatPrice(sumRecord.total_credit_begin, false, ','),
        //   style: {
        //     textAlign: 'right',
        //   },
        // },
        {
          index: 7,
          value: formatPrice(Math.round(sumRecord.total_debt_arise), false, ','),
          style: {
            textAlign: 'right',
          },
        },
        {
          index: 8,
          value: formatPrice(Math.round(sumRecord.total_credit_arise), false, ','),
          style: {
            textAlign: 'right',
          },
        },
        {
          index: 9,
          value: formatPrice(Math.round(sumRecord.total_debt), false, ','),
          style: {
            textAlign: 'right',
          },
        },
        {
          index: 10,
          value: formatPrice(Math.round(sumRecord.total_credit), false, ','),
          style: {
            textAlign: 'right',
          },
        },
      ]}
    />
  );
};

export default OtherVoucherTable;
