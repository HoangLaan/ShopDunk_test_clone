import DataTable from 'components/shared/DataTable/index';
import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deleteDepartment } from 'services/department.service';
import { PERMISSION } from '../utils/constants';
const DepartmentTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Mã phòng ban',
        classNameHeader: 'bw_text_center',
        accessor: 'department_id',
      },
      {
        header: 'Tên phòng ban',
        classNameHeader: 'bw_text_center',
        accessor: 'department_name',
      },
      {
        header: 'Trực thuộc phòng ban',
        classNameHeader: 'bw_text_center',
        accessor: 'parent_name',
      },
      {
        header: 'Trực thuộc công ty',
        classNameHeader: 'bw_text_center',
        accessor: 'company_name',
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        accessor: 'desc',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
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

  const handleDelete = useCallback(
    async (id) => {
      await deleteDepartment(id);
      onRefresh();
    },
    [onRefresh],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: PERMISSION.ADD,
        onClick: () => window._$g.rdr(`/department/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: PERMISSION.EDIT,
        onClick: (p) => window._$g.rdr(`/department/edit/${p?.department_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/department/detail/${p?.department_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: PERMISSION.DEL,
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
              handleDelete(_?.department_id);
            }),
          ),
      },
    ];
  }, [dispatch, handleDelete]);

  const handleBulkAction = (items, action) => {
    if (action === 'delete') {
      if (Array.isArray(items)) {
        dispatch(
          showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
            (items || []).forEach((item) => {
              handleDelete(item.department_id);
            });
          }),
        );
      }
    }
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={handleBulkAction}
    />
  );
};

export default DepartmentTable;
