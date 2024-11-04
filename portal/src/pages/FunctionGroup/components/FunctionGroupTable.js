import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deleteFunctionGroup } from 'services/function-group.service';

const FunctionGroupTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên nhóm quyền',
        accessor: 'function_group_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        accessor: 'description',
      },
      {
        header: 'Ngày tạo',
        accessor: 'create_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Thứ tự',
        accessor: 'order_index',
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
        permission: 'SYS_FUNCTIONGROUP_ADD',
        onClick: () => window._$g.rdr(`/function-groups/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SYS_FUNCTIONGROUP_EDIT',
        onClick: (p) => window._$g.rdr(`/function-groups/edit/${p?.function_group_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'SYS_FUNCTIONGROUP_VIEW',
        onClick: (p) => window._$g.rdr(`/function-groups/detail/${p?.function_group_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'SYS_FUNCTIONGROUP_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteFunctionGroup([_?.function_group_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

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
              await deleteFunctionGroup(e?.map((val) => parseInt(val?.function_group_id)));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default FunctionGroupTable;
