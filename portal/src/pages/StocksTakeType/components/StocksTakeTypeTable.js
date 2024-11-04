import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { deleteStocksTakeType } from '../helpers/call-api';

const StocksTakeTypeTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
}) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Tên hình thức kiểm kê',
        accessor: 'stocks_take_type_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
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
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'ST_STOCKSTAKETYPE_ADD',
        onClick: () => window._$g.rdr(`/stocks-take-type/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'ST_STOCKSTAKETYPE_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/stocks-take-type/edit/${p?.stocks_take_type_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'ST_STOCKSTAKETYPE_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/stocks-take-type/detail/${p?.stocks_take_type_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'ST_STOCKSTAKETYPE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete(_.stocks_take_type_id),
            ),
          ),
      },
    ];
  }, []);

  const handleBulkAction = (items, action) => {
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
          handleDelete(items),
        ),
      );
    }
  };

  const handleDelete = async (params) => {
    await deleteStocksTakeType(params);
    onRefresh();
  };

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

export default StocksTakeTypeTable;
