import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import { msgError } from '../helpers/msgError';

dayjs.extend(customParseFormat);

const CustomerTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, handleDelete, loading }) => {
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        header: 'Tên ca làm việc',
        accessor: 'shift_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.shift_name}</b>,
      },
      {
        header: 'Giờ bắt đầu',
        accessor: 'time_start',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.time_start}</span>,
      },
      {
        header: 'Giờ kết thúc',
        accessor: 'time_end',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.time_end}</span>,
      },
      {
        header: 'Thời gian(phút)',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'shift_time',
      },
      {
        header: 'Số công',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'numberofworkday',
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
        permission: 'MD_SHIFT_ADD',
        onClick: () => window._$g.rdr(`/shift/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'MD_SHIFT_EDIT',
        onClick: (p) => window._$g.rdr(`/shift/edit/${p?.shift_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'MD_SHIFT_VIEW',
        onClick: (p) => window._$g.rdr(`/shift/detail/${p?.shift_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'MD_SHIFT_DEL',
        onClick: (p) =>
          dispatch(
            showConfirmModal(msgError['model_error'], async () => {
              handleDelete(p);
            }),
          ),
      },
    ];
  }, [dispatch, handleDelete]);

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
    />
  );
};

export default CustomerTable;
