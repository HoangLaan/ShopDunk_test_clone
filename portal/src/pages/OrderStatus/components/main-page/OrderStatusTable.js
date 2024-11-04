import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { delOrderStatus } from 'services/order-status.service';

const OrderStatusTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên trạng thái',
        classNameHeader: 'bw_text_center',
        formatter: (p) =>
          p.order_status_name?.length > 50 ? p.order_status_name.substring(0, 50) + '...' : p.order_status_name,
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (p.description?.length > 50 ? p.description.substring(0, 50) + '...' : p.description),
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
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
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'SL_ORDERSTATUS_ADD',
        onClick: () => window._$g.rdr(`/order-status/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SL_ORDERSTATUS_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/order-status/edit/${p?.order_status_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'SL_ORDERSTATUS_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/order-status/view/${p?.order_status_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'SL_ORDERSTATUS_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await delOrderStatus([_?.order_status_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

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
              await delOrderStatus(e?.map((o) => o?.order_status_id));
              onRefresh();
            },
          ),
        )
      }
    />
  );
};

export default OrderStatusTable;
