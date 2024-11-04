import React, { useCallback } from 'react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import DataTable from 'components/shared/DataTable/index';
import { PERMISSIONS } from '../utils/permission';
import { formatPrice } from 'utils';
import { TYPE_ACCOUNT } from '../utils/constant';

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
  const styleBold = useCallback((index) => ({ fontWeight: index === data.length - 1 ? 'bold' : '' }), [data]);
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Ngày hạch toán',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'accounting_date',
      },
      {
        header: 'Ngày chứng từ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'voucher_date',
      },
      {
        header: 'Số chứng từ',
        classNameHeader: 'bw_text_center',
        accessor: 'voucher_code',
        formatter: (item) => {
          const { payment_type, type_account, id } = item;
          const typeAccountInstance = TYPE_ACCOUNT.find((type) => type.value === type_account);
          if (!typeAccountInstance) return;

          let url = typeAccountInstance.link_redirect;
          switch (type_account) {
            case 2:
            case 3:
              url = url.concat(
                `-${payment_type === 1 ? 'cash' : 'credit'}/detail/${id}_${type_account === 2 ? '1' : '2'}`,
              );
              break;
            case 4:
              const [purchase_orders_id, invoice_id] = id?.split('-');
              url = url.concat(`/${purchase_orders_id}?tab_active=invoice&open_popup=${invoice_id}`);
              break;
            case 9:
              url = url.concat(`/${id}?tab_active=invoice`);
              break;
            default:
              url = url.concat(`/${id}`);
              break;
          }

          return (
            <a
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={(e) => {
                e.preventDefault();
                window.open(url, '_blank', 'rel=noopener noreferrer');
              }}>
              {item.voucher_code}
            </a>
          );
        },
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
      },
      {
        header: 'Tài khoản ngân hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'bank_account',
      },
      {
        header: 'Số dư Nợ đầu kỳ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (item) => formatPrice(item?.debt_begin_money || 0, false, ','),
      },
      {
        header: 'Số dư Có đầu kỳ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (item) => formatPrice(item?.credit_begin_money || 0, false, ','),
      },
      {
        header: 'Phát sinh Nợ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'total_money',
        formatter: (item) => {
          if (item.is_total) return '';
          return formatPrice(item?.debt_arise_money || 0, false, ',');
        },
      },
      {
        header: 'Phát sinh Có',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'total_money',
        formatter: (item) => {
          if (item.is_total) return '';
          return formatPrice(item?.credit_arise_money || 0, false, ',');
        },
      },
      {
        header: 'Dư Nợ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (item, index) => {
          return <p style={styleBold(index)}>{formatPrice(item.debt_money < 0 ? 0 : item.debt_money, false, ',')}</p>;
        },
      },
      {
        header: 'Dư Có',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'total_money',
        formatter: (item, index) => {
          return (
            <p style={styleBold(index)}>{formatPrice(item.credit_money < 0 ? 0 : item.credit_money, false, ',')}</p>
          );
        },
      },
    ],
    [data],
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
      // customSumRow={
      //   [
      //     {
      //       index: 4,
      //       value: 'Tổng cộng',
      //       colSpan: 2,
      //       style: {
      //         textAlign: 'center',
      //       },
      //     },
      //     {
      //       index: 12,
      //       style: {
      //         textAlign: 'right',
      //       },
      //       formatter: (list) =>
      //         formatPrice(
      //           list.reduce((acc, cur) => (acc += cur?.debt_arise_money ?? 0), 0),
      //           false,
      //           ',',
      //         ),
      //     },
      //     {
      //       index: 13,
      //       style: {
      //         textAlign: 'right',
      //       },
      //       formatter: (list) =>
      //         formatPrice(
      //           list.reduce((acc, cur) => (acc += cur?.credit_arise_money ?? 0), 0),
      //           false,
      //           ',',
      //         ),
      //     },
      //   ]
      // }
    />
  );
};

export default OtherVoucherTable;
