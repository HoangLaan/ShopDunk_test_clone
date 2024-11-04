import React, { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import DataTable from 'components/shared/DataTable/index';
import { showToast } from 'utils/helpers';
import { TYPE_ACCOUNT } from '../utils/constant';
import TooltipHanlde from 'components/shared/TooltipWrapper';
import { formatPrice } from 'utils';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';

const AccountingTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  // sumRecord,
  exportExcel,
  exportPDF,
  onRefresh,
  setParams,
  paymentFormData = [],
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
      accessor: 'origin_date',
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
      classNameBody: 'bw_text_center bw_sticky bw_name_sticky',
      accessor: 'code',
    },
    {
      header: 'Diễn giải',
      accessor: 'explain',
      classNameHeader: 'bw_text_center',
      formatter: (p) => <TooltipHanlde maxString={50}>{p.explain}</TooltipHanlde>,
    },
    {
      header: 'Tài khoản',
      accessor: 'account_number',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
    },
    {
      header: 'Tài khoản đối ứng',
      accessor: 'reciprocalacc',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
    },
    {
      header: 'Phát sinh Nợ',
      accessor: 'arise_debit',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      formatter: (item) => {
        return formatPrice(item.arise_debit, false, ',');
      },
    },
    {
      header: 'Phát sinh Có',
      accessor: 'arise_credit',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      formatter: (item) => {
        return formatPrice(item.arise_credit, false, ',');
      },
    },
    {
      header: 'Hình thức thanh toán',
      classNameHeader: 'bw_text_center',
      formatter: (item) => {
        return (
          <TooltipHanlde>
            {paymentFormData
              .filter((pay) => item.payment_form_ids?.includes(String(pay.id)))
              .map((_) => _.name)
              .join(', ')}
          </TooltipHanlde>
        );
      },
    },
    {
      header: 'Chi nhánh',
      classNameHeader: 'bw_text_center',
      accessor: 'business_name',
    },
    {
      header: 'Số hóa đơn',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'invoice_no',
    },
    {
      header: 'Loại chứng từ',
      classNameHeader: 'bw_text_center',
      formatter: (item) => {
        return item.is_sum_record ? '' : TYPE_ACCOUNT.find((type) => type.value === item.type_account)?.label ?? 'Khác';
      },
    },
    {
      header: 'Mã đối tượng',
      classNameHeader: 'bw_text_center',
      accessor: 'object_code',
    },
    {
      header: 'Tên đối tượng',
      classNameHeader: 'bw_text_center',
      accessor: 'object_name',
    },
    {
      header: 'Nhân viên',
      classNameHeader: 'bw_text_center',
      accessor: 'user_name',
      formatter: (item) => {
        return item.is_sum_record ? '' : `${item.user_name} - ${item.user_full_name}`;
      },
    },
  ];

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out mr-2',
        color: 'green',
        content: 'Xuất Excel',
        permission: 'LEDGER_EXPORT',
        onClick: exportExcel,
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-print',
        type: 'warning',
        content: 'Xuất PDF',
        permission: 'LEDGER_PRINT',
        onClick: exportPDF,
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'blue',
        permission: 'AC_ACCOUNTING_VIEW',
        onClick: (item) => {
          const { receive_slip_id, payment_slip_id, payment_type, type_account, id } = item;
          const typeAccountInstance = TYPE_ACCOUNT.find((type) => type.value === type_account);
          if (!typeAccountInstance) return;

          let url = typeAccountInstance.link_redirect;
          switch (type_account) {
            case 2:
            case 3:
              url = url.concat(
                `-${payment_type === 1 ? 'cash' : 'credit'}/detail/${receive_slip_id || payment_slip_id}_${
                  receive_slip_id ? '1' : '2'
                }`,
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
          window._$g.rdr(url);
        },
      },
    ];
  }, [dispatch, exportExcel, exportPDF]);

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
      title={
        <>
          <label className='bw_checkbox'>
            {/* <input
            type='checkbox'
            onChange={(e) => {
              setParams((preParams) => ({ ...preParams, is_merge: e.target.checked ? 1 : 0 }));
            }}
          /> */}
            <FormInput field={'is_merge'} type={'checkbox'} />
            <span />
            Cộng gộp các bút toán giống nhau
          </label>

          <label className='bw_checkbox'>
            {/* <input
                type='checkbox'
                onChange={(e) => {
                  setParams((preParams) => ({ ...preParams, view_previous_accounting: e.target.checked ? 1 : 0 }));
                }}
              /> */}
            <FormInput field={'view_previous_accounting'} type={'checkbox'} />
            <span />
            Hiển thị số lũy kế kỳ trước chuyển sang
          </label>
        </>
      }
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
          index: 7,
          style: {
            textAlign: 'right',
          },
          formatter: (list = []) => {
            return formatPrice(
              list.reduce((acc, cur) => (acc += parseFloat(cur.arise_debit ?? 0)), 0),
              false,
              ',',
            );
          },
        },
        {
          index: 8,
          style: {
            textAlign: 'right',
          },
          formatter: (list = []) => {
            return formatPrice(
              list.reduce((acc, cur) => (acc += parseFloat(cur.arise_credit ?? 0)), 0),
              false,
              ',',
            );
          },
        },
      ]}
    />
  );
};

export default AccountingTable;
