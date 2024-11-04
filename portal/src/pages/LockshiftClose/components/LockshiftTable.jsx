import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import DataTable from 'components/shared/DataTable/index';

const LockshiftTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, loading, isEndShift }) => {
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        formatter: (value, index) => index + 1,
      },
      {
        header: 'Cửa hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'store_name',
      },
      {
        header: 'Ca làm việc',
        classNameHeader: 'bw_text_center',
        accessor: 'shift_name',
      },
      {
        header: 'Người kết ca',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Trưởng ca',
        classNameHeader: 'bw_text_center',
        accessor: 'shift_leader',
      },
      {
        header: 'Tổng tiền mặt cuối ca',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (value) => {
          return value?.total_cash?.toLocaleString('vi', { style: 'currency', currency: 'VND' });
        },
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Số lượng đơn hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'order_number',
      },
      {
        header: 'Ghi chú',
        classNameHeader: 'bw_text_center',
        accessor: 'note',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    const actions = [
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'MD_LOCKSHIFT_EDIT',
        onClick: (p) => window._$g.rdr(`/lockshift-close/edit/${p?.lockshift_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'MD_LOCKSHIFT_VIEW',
        onClick: (p) => window._$g.rdr(`/lockshift-close/detail/${p?.lockshift_id}`),
      },
    ];

    if (isEndShift) {
      actions.push({
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'MD_LOCKSHIFT_ADD',
        onClick: () => window._$g.rdr(`/lockshift-close/add`),
      });
    } else {
      actions.push({
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'normal',
        content: 'Thêm mới',
        permission: 'MD_LOCKSHIFT_ADD',
      });
    }

    return actions;
  }, [isEndShift]);

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

export default LockshiftTable;
