import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';

import { formatPrice } from 'utils/index';

const LockShiftReportTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
}) => {
  const columns = useMemo(
    () => [
      {
        header: 'Cửa hàng',
        accessor: 'store_name',
      },
      {
        header: 'Ca làm việc',
        accessor: 'shift_name',
      },
      {
        header: 'Người nhận ca',
        accessor: 'open_user',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Người kết ca',
        accessor: 'close_user',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trưởng ca',
        accessor: 'leader_user',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tổng tiền đầu ca',
        formatter: (value) => formatPrice(value.total_cash_open, true),
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
      },
      {
        header: 'Tổng tiền giao dịch trong ca',
        formatter: (value) => formatPrice(value.total_cash_shift, true),
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
      },
      {
        header: 'Tổng tiền cuối ca',
        formatter: (value) => formatPrice(value.total_cash_close, true),
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
      },
      {
        header: 'Tổng số đơn hàng giao dịch trong ca',
        accessor: 'order_number',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Ghi chú',
        accessor: 'note',
        classNameHeader: 'bw_text_center',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [];
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
      hiddenDeleteClick
      noSelect
    />
  );
};

export default LockShiftReportTable;
