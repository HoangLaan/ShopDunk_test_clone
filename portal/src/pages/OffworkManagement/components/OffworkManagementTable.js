import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable/index';
import classNames from 'classnames';
import { handleDelete } from 'services/offwork-management.service';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';

const OffworkManagementTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  loading,
  onRefresh,
}) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        formatter: (value, index) => index + 1,
      },
      {
        header: 'Tên chính sách quản lý phép tồn',
        classNameHeader: 'bw_text_center',
        accessor: 'time_can_off_policy_name',
      },
      {
        header: 'Công ty',
        classNameHeader: 'bw_text_center',
        accessor: 'company_name',
      },
      {
        header: 'khối',
        classNameHeader: 'bw_text_center',
        accessor: 'blocks',
        formatter: (p) => {
          return p?.blocks.map((x) => x.block_name).join(', ');
        },
      },
      {
        header: 'Phòng ban',
        classNameHeader: 'bw_text_center',
        accessor: 'departmant_name',
        formatter: (p) => {
          return p?.departments.map((x) => x.department_name).join(', ');
        },
      },
      {
        header: 'Kích hoạt',
        classNameHeader: 'bw_text_center',
        accessor: 'is_active',
        align: 'center',
        formatter: (p) => (
          <span
            className={classNames('bw_label_outline text-center', {
              bw_label_outline_success: p?.is_active,
              bw_label_outline_danger: !p?.is_active,
            })}>
            {p?.is_active ? 'Kích hoạt' : 'Ẩn'}
          </span>
        ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        //permission: 'HR_TIMECANOFF_POLICY_ADD',
        onClick: () => window._$g.rdr(`/off-work-management/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        //permission: 'HR_TIMECANOFF_POLICY_EDIT',
        onClick: (p) => window._$g.rdr(`/off-work-management/edit/${p?.time_can_off_policy_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        //permission: 'HR_TIMECANOFF_POLICY_VIEW',
        onClick: (p) => window._$g.rdr(`/off-work-management/detail/${p?.time_can_off_policy_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'HR_TIMECANOFF_POLICY_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await handleDelete(_?.time_can_off_policy_id);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <DataTable
      noSelect
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      loading={loading}
    />
  );
};

export default OffworkManagementTable;
