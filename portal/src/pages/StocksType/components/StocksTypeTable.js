import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { deleteStocksType, deleteListStocksType } from 'services/stocks-type.service';

import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';

const COLUMN_ID = 'stocks_type_id';

const StocksTypeTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        accessor: 'stocks_type_name',
        classNameHeader: 'bw_sticky bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Mã loại kho',
        accessor: 'stocks_type_code',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Tên loại kho',
        accessor: 'stocks_type_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
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
        header: 'Trạng Thái',
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
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm mới',
        permission: 'ST_STOCKSTYPE_VIEW',
        onClick: () => window._$g.rdr('/stocks-type/add'),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: 'ST_STOCKSTYPE_EDIT',
        onClick: (p) => window._$g.rdr(`/stocks-type/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        permission: 'ST_STOCKSTYPE_VIEW',
        onClick: (p) => window._$g.rdr(`/stocks-type/detail/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: 'ST_STOCKSTYPE_DEL',
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteStocksType([p?.[COLUMN_ID]]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <Fragment>
      <DataTable
        fieldCheck={COLUMN_ID}
        loading={loading}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        handleBulkAction={async (e) => {
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteListStocksType(e?.map((o) => o?.[COLUMN_ID]));
                document.getElementById('data-table-select')?.click();
                onRefresh();
              },
            ),
          );
        }}
      />
    </Fragment>
  );
};

export default StocksTypeTable;
