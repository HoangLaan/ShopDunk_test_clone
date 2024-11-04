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
        header: 'Mã đối tượng',
        classNameHeader: 'bw_text_center',
        accessor: 'customer_code',
      },
      {
        header: 'Tên đối tượng',
        classNameHeader: 'bw_text_center',
        accessor: 'customer_name',
      },
      {
        header: 'TK Công nợ',
        classNameHeader: 'bw_text_center',
        accessor: 'accounting_account',
        formatter: () => 331,
      },
      {
        header: 'Số dư Nợ đầu kỳ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (item) => {
          // return formatPrice(item?.debt_begin_money || 0, false, ',')
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
          // return formatPrice(item?.credit_begin_money || 0, false, ',')
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
          return <p>{money < 0 ? 0 : formatPrice(money, false, ',')}</p>;
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
          return <p>{money < 0 ? 0 : formatPrice(money, false, ',')}</p>;
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
        permission: PERMISSIONS.SL_RECEIVEPAY_EXPORT,
        onClick: handleExportExcel,
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: PERMISSIONS.SL_RECEIVEPAY_VIEW,
        onClick: (p) => {
          window._$g.rdr(`/receive-pay/detail?supplier_id=${p.supplier_id}&customer_type=${p.customer_type}`);
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
        //   // value: formatPrice(sumRecord.total_debt_begin, false, ','),
        //   style: {
        //     textAlign: 'right',
        //   },
        //   formatter: (list) =>
        //     formatPrice(
        //       list.reduce((acc, cur) => (acc += cur?.total_debt_begin ?? 0), 0),
        //       false,
        //       ',',
        //     ),
        // },
        // {
        //   index: 6,
        //   // value: formatPrice(sumRecord.total_credit_begin, false, ','),
        //   style: {
        //     textAlign: 'right',
        //   },
        //   formatter: (list) =>
        //     formatPrice(
        //       list.reduce((acc, cur) => (acc += cur?.total_credit_begin ?? 0), 0),
        //       false,
        //       ',',
        //     ),
        // },
        {
          index: 7,
          // value: formatPrice(sumRecord.total_debt_arise, false, ','),
          style: {
            textAlign: 'right',
          },
          formatter: (list) =>
            formatPrice(Math.round(
              list.reduce((acc, cur) => (acc += cur?.debt_arise_money ?? 0), 0)),
              false,
              ',',
            ),
        },
        {
          index: 8,
          // value: formatPrice(sumRecord.total_credit_arise, false, ','),
          style: {
            textAlign: 'right',
          },
          formatter: (list) =>
            formatPrice(Math.round(
              list.reduce((acc, cur) => (acc += cur?.credit_arise_money ?? 0), 0)),
              false,
              ',',
            ),
        },
        // {
        //   index: 9,
        //   value: formatPrice(
        //     sumRecord.total_debt_arise +
        //       sumRecord.total_debt_begin -
        //       sumRecord.total_credit_arise -
        //       sumRecord.total_credit_begin,
        //     false,
        //     ',',
        //   ),
        //   style: {
        //     textAlign: 'right',
        //   },
        // },
        // {
        //   index: 10,
        //   value: formatPrice(
        //     sumRecord.total_credit_begin +
        //       sumRecord.total_credit_arise -
        //       sumRecord.total_debt_arise -
        //       sumRecord.total_debt_begin,
        //     false,
        //     ',',
        //   ),
        //   style: {
        //     textAlign: 'right',
        //   },
        // },
      ]}
    />
  );
};

export default OtherVoucherTable;
