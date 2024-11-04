import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { deleteAnnounceType } from 'services/announce-type.service';

const AnnounceTypeTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh, loading }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên loại thông báo',
        accessor: 'announce_type_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Thể loại',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (p?.is_company ? 'Thông báo nội bộ' : 'Thông báo khách hàng'),
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
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'SYS_ANNOUNCETYPE_ADD',
        onClick: () => window._$g.rdr(`/announce-type/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SYS_ANNOUNCETYPE_EDIT',
        onClick: (p) => window._$g.rdr(`/announce-type/edit/${p?.announce_type_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'SYS_ANNOUNCETYPE_VIEW',
        onClick: (p) => window._$g.rdr(`/announce-type/view/${p?.announce_type_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'SYS_ANNOUNCETYPE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteAnnounceType([_?.announce_type_id]);
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
              await deleteAnnounceType(e?.map((o) => o?.announce_type_id));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default AnnounceTypeTable;
