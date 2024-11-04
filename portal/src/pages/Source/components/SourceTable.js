import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deleteSource } from 'services/source.service';

const SourceTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên nguồn khách hàng',
        accessor: 'source_name',
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
        permission: 'MD_SOURCE_ADD',
        onClick: () => window._$g.rdr(`/source/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'MD_SOURCE_EDIT',
        onClick: (p) => window._$g.rdr(`/source/edit/${p?.source_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'MD_SOURCE_VIEW',
        onClick: (p) => window._$g.rdr(`/source/detail/${p?.source_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'MD_SOURCE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteSource([_?.source_id]);
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
              await deleteSource(e?.map((val) => parseInt(val?.source_id)));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default SourceTable;
