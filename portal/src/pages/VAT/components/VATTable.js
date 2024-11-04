import React, { useMemo } from 'react';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { useDispatch } from 'react-redux';
import { deleteVAT } from '../helpers/call-api';
import Truncate from 'components/shared/Truncate';

const VATTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên VAT',
        accessor: 'vat_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Giá trị',
        classNameHeader: 'bw_text_center',
        accessor: 'value',
        formatter: (p) => `${p?.value} %`,
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        formatter: (d) => <Truncate>{d.desc}</Truncate>,
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Ngày tạo',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
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
        permission: 'MD_VAT_ADD',
        onClick: () => window._$g.rdr(`/vat/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'MD_VAT_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/vat/edit/${p?.vat_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'MD_VAT_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/vat/detail/${p?.vat_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'MD_VAT_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteVAT(_.vat_id);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

  const handleDelete = async (params) => {
    await deleteVAT(params);
    onRefresh();
  };

  const handleBulkAction = (items, action) => {
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], async () => {
          for (let _ of items) {
            await deleteVAT(_.vat_id);
          }
          onRefresh();
        }),
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

export default VATTable;
