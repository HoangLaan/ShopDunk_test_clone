import React, { useMemo } from 'react';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { useDispatch } from 'react-redux';
import { deleteStocks } from '../helpers/call-api';
import { showToast } from 'utils/helpers';

const MAX_COLUMN_IN_PAGE = 25;

const StocksTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        formatter: (_, index) => index + 1 + MAX_COLUMN_IN_PAGE * (parseInt(page) - 1),
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Mã kho',
        accessor: 'stocks_code',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.stocks_code}</b>,
      },
      {
        header: 'Tên kho',
        accessor: 'stocks_name',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.stocks_name}</b>,
      },
      {
        header: 'Loại kho',
        classNameHeader: 'bw_text_center',
        accessor: 'stocks_type_name',
      },
      {
        header: 'Cửa hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'store_name',
      },
      {
        header: 'Thuộc miền',
        classNameHeader: 'bw_text_center',
        accessor: 'business_name',
      },
      {
        header: 'Thuộc vùng',
        classNameHeader: 'bw_text_center',
        accessor: 'area_name',
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        accessor: 'phone_number',
      },
      {
        header: 'Địa chỉ',
        classNameHeader: 'bw_text_center',
        accessor: 'address',
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Trạng thái',
        classNameHeader: 'bw_text_center',
        accessor: 'is_active',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [page],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'ST_STOCKS_ADD',
        onClick: () => window._$g.rdr(`/stocks/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'ST_STOCKS_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/stocks/edit/${p?.stocks_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'ST_STOCKS_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/stocks/detail/${p?.stocks_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'ST_STOCKS_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete(_.stocks_id),
            ),
          ),
      },
    ];
  }, []);

  const handleDelete = async (params) => {
    const dataDel = await deleteStocks(params);
    if (dataDel?.length > 0) {
      for (const { stocks_id } of dataDel) {
        const stocks = data.find((s) => parseInt(s.stocks_id) === stocks_id);
        if (stocks) showToast.error(`${stocks.stocks_name} đang có sản phẩm tồn, không thể xóa !`);
      }
    }
    onRefresh();
  };

  const handleBulkAction = (items, action) => {
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
          handleDelete(items),
        ),
      );
    }
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

export default StocksTable;
