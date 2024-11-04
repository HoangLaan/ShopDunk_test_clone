import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { deleteRegimeType } from 'services/regime-type.service';

const RegimeTypeTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh, loading }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      // {
      //   header: 'Mã loại chế độ',
      //   accessor: 'regime_type_code',
      //   classNameHeader: 'bw_text_center',
      //   classNameBody: 'bw_text_center',
      // },
      {
        header: 'Tên loại chế độ',
        classNameHeader: 'bw_text_center',
        formatter: (value) =>
          value?.regime_type_name?.length > 50
            ? value?.regime_type_name?.substring(0, 50) + '...'
            : value?.regime_type_name,
      },
      {
        header: 'Thuộc loại chế độ',
        classNameHeader: 'bw_text_center',
        accessor: 'parent_name',
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        formatter: (value) =>
          value.description?.length > 20 ? value.description?.substring(0, 20) + '...' : value.description,
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
        permission: 'HR_REGIMETYPE_ADD',
        onClick: () => window._$g.rdr(`/regime-type/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'HR_REGIMETYPE_EDIT',
        onClick: (p) => window._$g.rdr(`/regime-type/edit/${p?.regime_type_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'HR_REGIMETYPE_VIEW',
        onClick: (p) => window._$g.rdr(`/regime-type/detail/${p?.regime_type_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'HR_REGIMETYPE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteRegimeType([_?.regime_type_id]);
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
              await deleteRegimeType(e?.map((o) => o?.regime_type_id));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default RegimeTypeTable;
