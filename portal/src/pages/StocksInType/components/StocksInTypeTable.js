import React, { useMemo } from 'react';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { useDispatch } from 'react-redux';
import { deleteStocksInType } from '../helpers/call-api';

const StocksInTypeTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center ',
        classNameBody: 'bw_sticky bw_name_sticky bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Tên hình thức phiếu nhập',
        accessor: 'stocks_in_type_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Loại hình thức nhập kho',
        accessor: 'stocks_in_type',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
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
        permission: 'ST_STOCKSINTYPE_ADD',
        onClick: () => window._$g.rdr(`/stocks-in-type/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'ST_STOCKSINTYPE_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/stocks-in-type/edit/${p?.stocks_in_type_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'ST_STOCKSINTYPE_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/stocks-in-type/detail/${p?.stocks_in_type_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'ST_STOCKSINTYPE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete(_.stocks_in_type_id),
            ),
          ),
      },
    ];
  }, []);

  const handleDelete = async (params) => {
    await deleteStocksInType(params);
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
      handleBulkAction={(e) =>
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              await deleteStocksInType(e);
              onRefresh();
            },
          ),
        )
      }
    />
  );
};

export default StocksInTypeTable;
