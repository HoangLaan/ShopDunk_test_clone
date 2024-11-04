import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';

import DataTable from 'components/shared/DataTable/index';
import { showConfirmModal } from 'actions/global';
import { msgError } from 'pages/OutputType/helpers/msgError';

dayjs.extend(customParseFormat);

const OutputTypeTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, handleDelete, loading }) => {
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        header: 'Tên hình thức xuất bán',
        accessor: 'output_type_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.output_type_name}</b>,
      },
      {
        header: 'Mức VAT',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.vat_name ? p?.vat_name : '---'}</span>,
      },
      {
        header: 'Công ty áp dụng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.company_name}</span>,
      },
      {
        header: 'Trạng thái',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'is_active',
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
        permission: 'SL_OUTPUTTYPE_ADD',
        onClick: () => window._$g.rdr(`/output-type/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SL_OUTPUTTYPE_EDIT',
        onClick: (p) => window._$g.rdr(`/output-type/edit/${p?.output_type_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'SL_OUTPUTTYPE_VIEW',
        onClick: (p) => window._$g.rdr(`/output-type/detail/${p?.output_type_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'SL_OUTPUTTYPE_DEL',
        onClick: (p) =>
          dispatch(
            showConfirmModal(msgError['model_error'], async () => {
              handleDelete(p?.output_type_id);
            }),
          ),
      },
    ];
  }, [dispatch, handleDelete]);

  const handleBulkAction = (items, action) => {
    let _mapOject = items.map((_key) => _key.output_type_id).join('|');
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
          handleDelete(_mapOject),
        ),
      );
    }
  };

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
      loading={loading}
      handleBulkAction={handleBulkAction}
    />
  );
};

export default OutputTypeTable;
