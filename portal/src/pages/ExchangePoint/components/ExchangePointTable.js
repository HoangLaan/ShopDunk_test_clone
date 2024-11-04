import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deleteExchangePoint } from 'services/exchange-point.service';
const ExchangePointTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
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
        header: 'Tên chương trình',
        accessor: 'ex_point_name',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Loại khách hàng áp dụng',
        accessor: 'full_name',
        classNameHeader: 'bw_text_center',
        formatter: (item, index) =>
          item.is_all_member_type ? 'Áp dụng với tất cả khách hàng' : 'Áp dụng với ' + item.customer_type_name,
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
        classNameBody: 'bw_text_center',
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
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'PT_EXCHANGEPOINT_ADD',
        onClick: () => window._$g.rdr(`/exchange-point/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'PT_EXCHANGEPOINT_EDIT',
        onClick: (p) => window._$g.rdr(`/exchange-point/edit/${p?.ex_point_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'PT_EXCHANGEPOINT_VIEW',
        onClick: (p) => window._$g.rdr(`/exchange-point/detail/${p?.ex_point_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'PT_EXCHANGEPOINT_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteExchangePoint([_?.ex_point_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

  return (
    <DataTable
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
              await deleteExchangePoint(e?.map((val) => parseInt(val?.ex_point_id)));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default ExchangePointTable;
