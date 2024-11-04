import React, { useMemo } from 'react';

import DataTable from 'components/shared/DataTable/index';

function StocksTransferTypeTable({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleActionRow,
  handleBulkAction,
}) {
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Tên hình thức',
        accessor: 'stocks_transfer_type_name',
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
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Trạng thái',
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

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        onClick: () => window._$g.rdr('/stocks-transfer-type/add'),
        permission: 'ST_STOCKSTRANSFERTYPE_ADD',
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        onClick: (p) => handleActionRow(p, 'edit'),
        permission: 'ST_STOCKSTRANSFERTYPE_EDIT',
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'ST_STOCKSTRANSFERTYPE_VIEW',
        onClick: (p) => handleActionRow(p, 'detail'),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        onClick: (p) => handleActionRow(p, 'delete'),
        permission: 'ST_STOCKSTRANSFERTYPE_DELETE',
      },
    ];
  }, []);

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
}

export default StocksTransferTypeTable;
