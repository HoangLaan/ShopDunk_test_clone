import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { showConfirmModal } from 'actions/global';
import { delCommission, deleteCommission } from 'services/commission.service';
import { COMMISSION_PERMISSION } from 'pages/Commission/helpers/constants';
import ICON_COMMON from 'utils/icons.common';

const TableCommission = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên chương trình',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.commission_name ?? 'Chưa cập nhật'}</b>,
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Thời gian áp dụng',
        accessor: 'date_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Người tạo',

        accessor: 'created_user',
      },
      {
        header: 'Trạng thái',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => (
          <span
            className={classNames('bw_badge', {
              bw_badge_success: p?.status_name === 'Đang áp dụng',
              bw_badge_danger: p?.status_name === 'Đã hết hạn' || p?.status_name === 'Từ chối duyệt',
              bw_badge_warning: p?.status_name === 'Dừng áp dụng',
            })}>
            {p?.status_name}
          </span>
        ),
      },
      {
        header: 'Công ty áp dụng',
        classNameHeader: 'bw_text_center',
        accessor: 'company_name',
      },
      {
        header: 'Kích hoạt',
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
        permission: COMMISSION_PERMISSION.ADD,
        onClick: () => window._$g.rdr(`/commission/add`),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: COMMISSION_PERMISSION.EDIT,
        onClick: (p) => window._$g.rdr(`/commission/edit/${p?.commission_id}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        permission: COMMISSION_PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/commission/detail/${p?.commission_id}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: COMMISSION_PERMISSION.DEL,
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteCommission(p?.commission_id);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

  return (
    <DataTable
      fieldCheck='commission_id'
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
              await delCommission(e?.map((o) => o?.commission_id));
              document.querySelector('#data-table-select')?.click();
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default TableCommission;
