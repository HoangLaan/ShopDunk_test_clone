import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import { deleteULHistory } from 'services/user-level-history.service';

const UserLevelHistoryTable = ({
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
        header: 'Nhân viên',
        accessor: 'fullname',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Ngày cập nhật',
        accessor: 'apply_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Phòng ban',
        accessor: 'department_new_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Chức vụ',
        accessor: 'position_new_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Cấp độ cũ',
        accessor: 'position_level_old_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Cấp độ mới',
        accessor: 'position_level_new_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Người chuyển',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
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
        content: 'Chuyển cấp',
        permission: 'SYS_USERLEVEL_HISTORY_ADD',
        onClick: () => window._$g.rdr(`/user-level-history/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SYS_USERLEVEL_HISTORY_EDIT',
        onClick: (p) => window._$g.rdr(`/user-level-history/edit/${p?.user_level_history_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'SYS_USERLEVEL_HISTORY_VIEW',
        onClick: (p) => window._$g.rdr(`/user-level-history/detail/${p?.user_level_history_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'SYS_USERLEVEL_HISTORY_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteULHistory([parseInt(_?.user_level_history_id)]);
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
              await deleteULHistory(e?.map((val) => parseInt(val?.user_level_history_id)));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default UserLevelHistoryTable;
