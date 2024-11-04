import React, { Fragment, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { handleDelete } from 'services/short-link.service';
import classNames from 'classnames';
import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
const COLUMN_ID = 'short_link_id';

function ShortLinkTable({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) {
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
        header: 'Tên chiến dịch',
        accessor: 'short_link_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Loại ShortLink',
        accessor: 'short_link_type',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.short_link_type === 1 ? 'Pre-order' : 'None Pre-order'}</span>,
      },
      {
        header: 'Link redirect',
        accessor: 'short_link_redirect',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Short code',
        accessor: 'short_code',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Kích hoạt',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => (
          <span
            className={classNames('bw_label_outline text-center', {
              bw_label_outline_success: p?.is_active,
              bw_label_outline_danger: !p?.is_active,
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
        // permission: PERMISSION.ADD,
        onClick: () => window._$g.rdr('/short-link/add'),
      },

      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        // permission: PERMISSION.EDIT,
        onClick: (p) => window._$g.rdr(`/short-link/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        // permission: PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/short-link/detail/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        // permission: PERMISSION.DEL,
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await handleDelete({ short_link_id: p?.[COLUMN_ID] });
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
      />
    </Fragment>
  );
}

export default ShortLinkTable;
