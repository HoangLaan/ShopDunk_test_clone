import React, { useEffect } from 'react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import DataTable from 'components/shared/DataTable/index';
import TooltipHanlde from 'components/shared/TooltipWrapper';
import { formatPrice, formatPriceNegative, formatPricePurchaseOrder } from 'utils';
import { useFormContext } from 'react-hook-form';

const ReportTableFull = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  exportExcel,
  setParams,
  openFilter,
  meta,
}) => {
  const dispatch = useDispatch();
  const { watch } = useFormContext();
  const columns = [
    {
      header: 'Ngày hạch toán',
      style: {
        left: 0,
      },
      styleHeader: {
        left: 0,
      },
      classNameHeader: 'bw_text_center bw_sticky bw_name_sticky',
      classNameBody: 'bw_text_center bw_sticky bw_name_sticky',
      accessor: 'accounting_date',
    },
    {
      style: {
        left: '120px',
      },
      styleHeader: {
        left: '120px',
      },
      header: 'Ngày chứng từ',
      classNameHeader: 'bw_text_center bw_sticky bw_name_sticky',
      classNameBody: 'bw_text_center bw_sticky bw_name_sticky',
      accessor: 'receiverslip_date',
    },
    {
      style: {
        left: '235px',
      },
      styleHeader: {
        left: '235px',
      },
      header: 'Số chứng từ',
      classNameHeader: 'bw_text_center bw_sticky bw_name_sticky',
      classNameBody: 'bw_text_left bw_sticky bw_name_sticky',
      accessor: 'code',
      formatter: (p) => {
        return (
          <span
            style={{ color: '#1399B7', cursor: 'pointer' }}
            onClick={() => window.open(`/orders/detail/${p?.order_id}?tab_active=information`)}>
            {p?.code}
          </span>
        );
      },
    },
    {
      header: 'Ngày hóa đơn',
      accessor: 'explain',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
    },
    {
      header: 'Số hóa đơn',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      classNameBody: 'bw_text_left',
      accessor: 'invoice_no',
    },
    {
      header: 'Diễn giải chung',
      accessor: 'notes',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_left',
      formatter: (p) => <TooltipHanlde maxString={50}>{p.notes}</TooltipHanlde>,
    },
    {
      header: 'Tên hàng trên chứng từ',
      accessor: 'product_display_name',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_left',
    },
    {
      header: 'Mã khách hàng',
      accessor: 'customer_code',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_left',
    },
    {
      header: 'Tên khách hàng',
      accessor: 'customer_name',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_left',
    },
    {
      header: 'Mã số thuế',
      accessor: 'tax',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_left',
    },
    {
      header: 'IMEI/Seri',
      accessor: 'imei',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_left',
    },
    {
      header: 'Mã hàng',
      accessor: 'product_code',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_left',
    },
    {
      header: 'Tên hàng',
      accessor: 'product_name',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_left',
    },
    {
      header: 'ĐVT',
      accessor: 'unit',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_left',
    },
    {
      header: 'Tổng số lượng bán',
      accessor: 'total_sell',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
    },
    {
      header: 'Đơn giá',
      accessor: 'price',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      formatter: (item) => {
        return formatPricePurchaseOrder(+item.price);
      },
    },
    {
      header: 'Doanh số bán',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      formatter: (i) => {
        return formatPrice(i?.price * i?.total_sell, false, ',');
      },
    },
    {
      header: 'TK Nợ',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_left',
      accessor: 'revenue_account',
    },
    {
      header: 'TK có',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_left',
      accessor: 'debt_account',
    },
    {
      header: 'Chiết khấu',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      accessor: 'discount_value',
      formatter: (item) => {
        return formatPrice(item?.discount_value, false, ',');
      },
    },
    {
      header: 'Tổng số lượng trả lại',
      classNameHeader: 'bw_text_center',
      accessor: 'object_name',
    },
    {
      header: 'Giá trị trả lại',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      accessor: 'user_name',
    },
    {
      header: 'Giá trị giảm giá',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      accessor: 'user_name',
    },
    {
      header: 'Thuế GTGT',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      accessor: 'vat',
      formatter: (item) => {
        return formatPrice(item?.vat, false, ',');
      },
    },
    {
      header: 'Tổng thanh toán',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      accessor: 'total_pay',
      formatter: (item) => {
        return formatPrice(item?.total_pay, false, ',');
      },
    },
    {
      header: 'Đơn giá vốn',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      formatter: (item) => {
        return formatPricePurchaseOrder(+item?.money);
      },
    },
    {
      header: 'TK giá vốn',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_left',
      accessor: 'account_money',
    },
    {
      header: 'TK Kho',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_left',
      accessor: 'account_stocks',
    },
    {
      header: 'Giá vốn',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      formatter: (item) => {
        return formatPrice(item?.money * item?.total_sell, false, ',');
      },
    },
    {
      header: 'Mã Kho',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_left',
      accessor: 'code_stocks',
    },
    {
      header: 'LN gộp',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      formatter: (item) => {
        return formatPriceNegative(item.price - item?.money, ',');
      },
    },
    // {
    //   header: 'Tổng LN gộp',
    //   classNameHeader: 'bw_text_center',
    //   classNameBody: 'bw_text_right',
    //   formatter: (item) => {
    //     // return formatPriceNegative((((item?.total_pay * item?.total_sell) - (item?.money * item?.total_sell)) * item?.total_sell), ',');
    //     return formatPriceNegative((item.price - item?.money), ',');
    //   },
    // },
  ];

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out mr-2',
        color: 'green',
        content: 'Xuất Excel',
        permission: 'RP_SALESDETAILBOOK_EXPORT',
        onClick: exportExcel,
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-filter mr-2',
        color: 'green',
        permission: 'RP_SALESDETAILBOOK_ACCOUNTING_VIEW',
        onClick: openFilter,
      },
    ];
  }, [dispatch, exportExcel]);

  const is_merge = watch('is_merge');
  useEffect(() => {
    setParams((preParams) => ({ ...preParams, is_merge }));
  }, [is_merge]);

  const view_previous_accounting = watch('view_previous_accounting');
  useEffect(() => {
    setParams((preParams) => ({ ...preParams, view_previous_accounting }));
  }, [view_previous_accounting]);

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
          value: 'Tổng cộng: ',
          colSpan: 3,
          style: {
            textAlign: 'center',
          },
        },
        {
          index: 15,
          style: {
            textAlign: 'right',
          },
          formatter: (list = []) => {
            return formatPrice(meta?.total_amount, false, ',');
          },
        },
        {
          index: 17,
          style: {
            textAlign: 'right',
          },
          formatter: (list = []) => {
            return formatPrice(meta?.total_money_order, false, ',');
          },
        },
        {
          index: 23,
          style: {
            textAlign: 'right',
          },
          formatter: (list = []) => {
            return formatPrice(meta?.total_vat, false, ',');
          },
        },
        {
          index: 24,
          style: {
            textAlign: 'right',
          },
          formatter: (list = []) => {
            return formatPrice(meta?.total_payment, false, ',');
          },
        },
      ]}
    />
  );
};

export default ReportTableFull;
