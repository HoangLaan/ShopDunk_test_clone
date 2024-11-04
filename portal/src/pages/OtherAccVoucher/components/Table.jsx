import React, { useCallback } from 'react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import { deleteList } from 'services/other-acc-voucher.service';
import DataTable from 'components/shared/DataTable/index';
import { PERMISSIONS } from '../utils/permission';
import { showToast } from 'utils/helpers';
import { formatPrice } from 'utils';
import TooltipHanlde from 'components/shared/TooltipWrapper';

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
  handleExportPDF,
  loadingPdf,
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
        header: 'Ngày hạch toán',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Ngày chứng từ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'invoice_date',
      },
      {
        header: 'Số chứng từ',
        classNameHeader: 'bw_text_center',
        accessor: 'other_acc_voucher_code',
      },
      {
        header: 'Diễn giải',
        classNameHeader: 'bw_text_center',
        accessor: 'description',
        formatter: (item) => <TooltipHanlde maxString={50}>{item?.description}</TooltipHanlde>,
      },
      {
        header: 'Số tiền',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'total_money',
        formatter: (item) => formatPrice(item?.total_money || 0, false, ','),
      },
      {
        header: 'Loại chứng từ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'voucher_type_name',
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Trạng thái ghi sổ',
        accessor: 'is_bookkeeping',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_bookkeeping ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Đã ghi sổ</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Chưa ghi sổ</span>
          ),
      },
    ],
    [],
  );

  const handleDelete = useCallback(
    async (params) => {
      await deleteList(params);
      onRefresh();
    },
    [onRefresh],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out',
        style: { margin: 0, marginRight: '10px' },
        type: 'warning',
        content: 'Xuất Excel',
        permission: PERMISSIONS.AC_OTHERACCVOUCHER_EXPORT,
        onClick: handleExportExcel,
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        style: { margin: 0 },
        type: 'success',
        content: 'Thêm mới',
        permission: PERMISSIONS.AC_OTHERACCVOUCHER_ADD,
        onClick: () => window._$g.rdr(`/other-voucher/add`),
      },
      {
        icon: 'fi fi fi-rr-print',
        color: 'black',
        permission: PERMISSIONS.AC_OTHERACCVOUCHER_PRINT,
        onClick: (p) => {
          handleExportPDF(p?.other_acc_voucher_id);
        },
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: PERMISSIONS.AC_OTHERACCVOUCHER_EDIT,
        onClick: (p) => {
          window._$g.rdr(`/other-voucher/edit/${p?.other_acc_voucher_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: PERMISSIONS.AC_OTHERACCVOUCHER_VIEW,
        onClick: (p) => {
          window._$g.rdr(`/other-voucher/detail/${p?.other_acc_voucher_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: (p) => p.is_bookkeeping,
        permission: PERMISSIONS.AC_OTHERACCVOUCHER_DEL,
        onClick: (p) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete([p.other_acc_voucher_id]),
            ),
          ),
      },
    ];
  }, [dispatch, handleDelete]);

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
    />
  );
};

export default OtherVoucherTable;
