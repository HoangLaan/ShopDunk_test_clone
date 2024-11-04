import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import { deleteCashFlow, getCashFlowList } from 'services/cash-flow.service';

const CashFlowTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  exportExcel,
  importExcel,
  getChildren
}) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Mã dòng tiền',
        accessor: 'cash_flow_code',
        expanded: true,
      },
      {
        header: 'Tên dòng tiền',
        accessor: 'cash_flow_name',
      },
      {
        header: 'Công ty áp dụng',
        accessor: 'company_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out',
        type: 'success',
        content: 'Xuất excel',
        outline: true,
        onClick: () => exportExcel(),
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-in',
        type: 'success',
        outline: true,
        content: 'Nhập excel',
        onClick: () => importExcel(),
      },
      {
        globalAction: true,
        icon: 'fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'MD_STORETYPE_ADD',
        onClick: () => window._$g.rdr(`/cash-flow/add`),
      },
      {
        icon: 'fi-rr-copy-alt',
        color: 'ogrance',
        permission: 'MD_STORETYPE_ADD',
        onClick: (p) => window._$g.rdr(`/cash-flow/copy/add/${p?.cash_flow_id}`),
      },
      {
        icon: 'fi-rr-edit',
        color: 'blue',
        permission: 'MD_STORETYPE_EDIT',
        onClick: (p) => window._$g.rdr(`/cash-flow/edit/${p?.cash_flow_id}`),
      },
      {
        icon: 'fi-rr-eye',
        color: 'green',
        permission: 'MD_STORETYPE_VIEW',
        onClick: (p) => window._$g.rdr(`/cash-flow/detail/${p?.cash_flow_id}`),
      },
      {
        icon: 'fi-rr-trash',
        color: 'red',
        permission: 'MD_STORETYPE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteCashFlow([parseInt(_?.cash_flow_id)]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh, exportExcel, importExcel]);

  return (
    <DataTable
      parentField='cash_flow_id'
      getChildren={getCashFlowList}
      loading={loading}
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={(e) => {
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              await deleteCashFlow(e?.map((val) => parseInt(val?.cash_flow_id)));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default CashFlowTable;
