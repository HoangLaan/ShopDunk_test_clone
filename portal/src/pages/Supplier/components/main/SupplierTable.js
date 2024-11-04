import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import { deleteSupplier } from 'services/supplier.service';
import DataTable from 'components/shared/DataTable/index';
import { SUPPLIER_PERMISSION } from 'pages/Supplier/utils/constants';
import { splitString } from 'utils/index';
import TooltipHanlde from 'components/shared/TooltipWrapper';
import { MAX_ITEM_PER_PAGE } from 'utils/helpers';

const MAX_COLUMN_IN_PAGE = structuredClone(MAX_ITEM_PER_PAGE);

const SupplierTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        formatter: (_, index) => index + 1 + (MAX_COLUMN_IN_PAGE * (parseInt(page) - 1)),
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Mã nhà cung cấp',
        accessor: 'supplier_code',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên nhà cung cấp',
        accessor: 'supplier_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên thay thế',
        accessor: 'altname',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên người đại diện',
        accessor: 'representative_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Địa chỉ cung cấp',
        accessor: 'address_full',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <TooltipHanlde>{p?.address_full}</TooltipHanlde>,
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
    ],
    [page],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: SUPPLIER_PERMISSION.ADD,
        onClick: () => window._$g.rdr(`/supplier/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        title: 'Sửa',
        permission: SUPPLIER_PERMISSION.EDIT,
        onClick: (p) => window._$g.rdr(`/supplier/edit/${p?.supplier_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        title: 'Chi tiết',
        permission: SUPPLIER_PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/supplier/detail/${p?.supplier_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        title: 'Xóa',
        permission: SUPPLIER_PERMISSION.DEL,
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteSupplier([_?.supplier_id]);
                onRefresh();
              },
            ),
          ),
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
      handleBulkAction={(e) => {
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              for (let _ of e) {
                await deleteSupplier(_?.supplier_id);
                onRefresh();
              }
            },
          ),
        );
      }}
    />
  );
};

export default SupplierTable;
