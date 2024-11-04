import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable/index';
import { getIsAllowOpenShift } from '../../../services/lockshift-open.service';

const LockShiftTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, loading }) => {
  const [isAllowOpenShift, setIsAllowOpenShift] = useState(false);
  const checkIsAllowOpenShift = useCallback(async () => {
    const data = await getIsAllowOpenShift();
    setIsAllowOpenShift(Boolean(data?.isAllow));
  }, []);

  useEffect(() => {
    checkIsAllowOpenShift();
  }, [checkIsAllowOpenShift]);
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
        header: 'Người nhận ca',
        classNameHeader: 'bw_text_center',
        accessor: 'shift_recipient',
        formatter: (p) => <p>{p?.shift_recipient + ' - ' + p?.shift_leader_fullname}</p>,
      },
      {
        header: 'Trưởng ca',
        classNameHeader: 'bw_text_center',
        accessor: 'shift_leader',
        formatter: (p) => <p>{p?.shift_leader + ' - ' + p?.shift_recipient_fullname}</p>,
      },
      {
        header: 'Tổng tiền mặt ca trước bàn giao',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (value) => {
          return (value.total_cash_parent || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' });
        },
      },
      {
        header: 'Tổng tiền mặt ca thực kiểm đếm',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (value) => {
          return (value.total_cash || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' });
        },
      },
      {
        header: 'Chênh lệch',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (value) => {
          return ((value.total_cash || 0) - value.total_cash_parent || 0).toLocaleString('vi', {
            style: 'currency',
            currency: 'VND',
          });
        },
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_date',
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
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        disabled: !isAllowOpenShift,
        permission: 'MD_LOCKSHIFT_ADD',
        onClick: () => window._$g.rdr(`/lockshift-open/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'MD_LOCKSHIFT_EDIT',
        onClick: (p) => window._$g.rdr(`/lockshift-open/edit/${p?.lock_shift_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'MD_LOCKSHIFT_EDIT',
        onClick: (p) => window._$g.rdr(`/lockshift-open/detail/${p?.lock_shift_id}`),
      },
    ];
  }, [isAllowOpenShift]);

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

export default LockShiftTable;
