import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import { msgError } from '../helpers/msgError';

dayjs.extend(customParseFormat);
const MAX_COLUMN_IN_PAGE = 25;

const RequestPoRLTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  loading,
  totalItems,
  onChangePage,
  handleDelete,
}) => {
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
        header: 'Mức duyệt',
        accessor: 'review_level_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky bw_text_center',
        formatter: (p) => <span className='bw_sticky bw_name_sticky'>{p?.review_level_name}</span>,
      },
      {
        header: 'Miền áp dụng',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.business_name}</span>,
      },
      {
        header: 'Người tạo',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.created_user}</span>,
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_date',
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
    [page],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'REQUEST_PO_REVIEWLEVEL_ADD',
        onClick: () => window._$g.rdr(`/request-po-rl/add`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'REQUEST_PO_REVIEWLEVEL_VIEW',
        onClick: (p) => window._$g.rdr(`/request-po-rl/detail/${p?.request_po_review_level_id}`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'REQUEST_PO_REVIEWLEVEL_EDIT',
        onClick: (p) => window._$g.rdr(`/request-po-rl/edit/${p?.request_po_review_level_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'REQUEST_PO_REVIEWLEVEL_DEL',
        onClick: (p) =>
          dispatch(
            showConfirmModal(msgError['model_error'], async () => {
              handleDelete([p?.request_po_review_level_id]);
            }),
          ),
      },
    ];
  }, []);

  const handleBulkAction = (items, action) => {
    let _mapOject = items.map((_key) => _key.request_po_review_level_id);
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
      handleBulkAction={handleBulkAction}
      loading={loading}
    />
  );
};

export default RequestPoRLTable;
