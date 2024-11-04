import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { PERMISSION_STORE } from 'pages/Store/helpers/constants';

const StoreTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleActionRow,
  handleBulkAction,
}) => {
  const columns = useMemo(
    () => [
      {
        header: 'Mã cửa hàng',
        accessor: 'store_code',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.store_code}</b>,
      },
      {
        header: 'Cửa hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'store_name',
      },
      {
        header: 'Địa chỉ',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.address}</span>,
      },
      {
        header: 'Khu vực',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.area_name}</span>,
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.phone_number}</span>,
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
            <span className='bw_label_outline bw_label_outline_danger text-center'>Khóa</span>
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
        permission: PERMISSION_STORE.ADD,
        onClick: () => window._$g.rdr('/store/add'),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: PERMISSION_STORE.EDIT,
        onClick: (p) => handleActionRow(p, 'edit'),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: PERMISSION_STORE.VIEW,
        onClick: (p) => handleActionRow(p, 'detail'),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: PERMISSION_STORE.DELETE,
        onClick: (p) => handleActionRow(p, 'delete'),
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
      handleBulkAction={handleBulkAction}
    />
  );
};

export default StoreTable;
