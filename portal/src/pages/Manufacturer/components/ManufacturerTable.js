import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { deleteManufacturer } from 'services/manufacturer.service';
import { MANUFACTURER_PERMISSION } from '../utils/constants';

const ManufacturerTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Mã hãng',
        accessor: 'manufacturer_code',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên hãng',
        accessor: 'manufacturer_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên thay thế',
        accessor: 'alt_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Người đại diện',
        accessor: 'representative_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Số điện thoại',
        accessor: 'representative_phone',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Địa chỉ',
        classNameHeader: 'bw_text_center',
        formatter: (p) =>
          [p?.manufacturer_address, p?.ward_name, p?.district_name, p?.province_name]
            .filter((element) => element !== undefined)
            .join(', '),
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
        permission: MANUFACTURER_PERMISSION.ADD,
        onClick: () => window._$g.rdr(`/manufacturer/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: MANUFACTURER_PERMISSION.EDIT,
        onClick: (p) => window._$g.rdr(`/manufacturer/edit/${p?.manufacturer_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: MANUFACTURER_PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/manufacturer/detail/${p?.manufacturer_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: MANUFACTURER_PERMISSION.DEL,
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteManufacturer([_?.manufacturer_id]);
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
      handleBulkAction={(e) =>
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              await deleteManufacturer(e?.map((o) => o?.manufacturer_id));
              onRefresh();
            },
          ),
        )
      }
    />
  );
};

export default ManufacturerTable;
