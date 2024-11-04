import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { deleteReceiveType, getTreeReceiveType, getListReceiveType } from 'services/receive-type.service';

const ReceiveTypeTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  loading,
  params,
}) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Mã loại thu',
        accessor: 'receive_type_code',
        classNameHeader: 'bw_text_center',
        expanded: true,
      },
      {
        header: 'Tên loại thu',
        accessor: 'receive_type_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Loại thu cha',
        accessor: 'receive_type_parent_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Công ty áp dụng',
        accessor: 'company_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Mô tả',
        accessor: 'description',
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
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
    ],
    [page],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'MD_RECEIVETYPE_ADD',
        onClick: () => window._$g.rdr(`/receive-type/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'MD_RECEIVETYPE_EDIT',
        onClick: (p) => window._$g.rdr(`/receive-type/edit/${p?.receive_type_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'MD_RECEIVETYPE_VIEW',
        onClick: (p) => window._$g.rdr(`/receive-type/view/${p?.receive_type_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'MD_RECEIVETYPE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteReceiveType([_?.receive_type_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

  return (
    <DataTable
      getChildren={async (query) => {
        return getListReceiveType({ ...params, ...query, itemsPerPage: 15, level: null });
      }}
      loading={loading}
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      parentField='receive_type_id'
      handleBulkAction={(e) => {
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              await deleteReceiveType(e?.map((o) => o?.receive_type_id));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default ReceiveTypeTable;
