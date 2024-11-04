import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deleteTransferShiftType } from 'services/transfer-shift-type.service';

const TransferShiftTypeTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
}) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (d, i) => i + 1,
      },
      {
        header: 'Tên loại yêu cầu chuyển ca',
        accessor: 'transfer_shift_type_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky bw_title_page',
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
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
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
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
        permission: 'HR_TRANSFERSHIFT_TYPE_ADD',
        onClick: () => window._$g.rdr(`/transfer-shift-type/add`),
      },

      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'HR_TRANSFERSHIFT_TYPE_EDIT',
        onClick: (p) => window._$g.rdr(`/transfer-shift-type/edit/${p?.transfer_shift_type_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'HR_TRANSFERSHIFT_TYPE_VIEW',
        onClick: (p) => window._$g.rdr(`/transfer-shift-type/detail/${p?.transfer_shift_type_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'HR_TRANSFERSHIFT_TYPE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteTransferShiftType([_?.transfer_shift_type_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

  return (
    <DataTable
      noSelect={true}
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
              await deleteTransferShiftType(e?.map((val) => parseInt(val?.transfer_shift_type_id)));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default TransferShiftTypeTable;
