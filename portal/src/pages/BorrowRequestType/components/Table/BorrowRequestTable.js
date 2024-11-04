import React, { Fragment, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';
import { deleteByID, deleteListBorrowType } from 'services/borrow-type.service';
import { listTypeBorrow } from '../../utils/utils';

const COLUMN_ID = 'borrow_type_id';

const BorrowRequestTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        header: 'Tên hình thức mượn hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'borrow_type_name',
      },
      {
        header: 'Loại hình thức mượn hàng',
        classNameHeader: 'bw_text_center',
        formatter: (_, i) => {
          if (_.is_for_sale) return listTypeBorrow.find((tmp) => tmp.key === 'is_for_sale')['label'];
          if (_.is_borrow_partner) return listTypeBorrow.find((tmp) => tmp.key === 'is_borrow_partner')['label'];
          if (_.is_other) return listTypeBorrow.find((tmp) => tmp.key === 'is_other')['label'];
        },
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
        header: 'Kích hoạt',
        classNameHeader: 'bw_text_center',
        accessor: 'is_active',
        formatter: (p) => (
          <span
            className={classNames('bw_label_outline bw_label_outline_success text-center', {
              success: p?.is_active,
              danger: !p?.is_active,
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
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm mới',
        permission: 'FI_BUDGETTYPE_ADD',
        onClick: () => window._$g.rdr('/borrow-request-type/add'),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: 'FI_BUDGETTYPE_EDIT',
        onClick: (p) => window._$g.rdr(`/borrow-request-type/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        permission: 'FI_BUDGETTYPE_VIEW',
        onClick: (p) => window._$g.rdr(`/borrow-request-type/detail/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: 'FI_BUDGETTYPE_DEL',
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteByID([p?.[COLUMN_ID]]);
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
                await deleteListBorrowType(e?.map((o) => o?.[COLUMN_ID]));
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

export default BorrowRequestTable;
