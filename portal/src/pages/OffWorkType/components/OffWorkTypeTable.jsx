import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { showConfirmModal } from 'actions/global';
import { useDispatch, useSelector } from 'react-redux';
import { msgError } from '../helpers/msgError';

dayjs.extend(customParseFormat);

const CustomerTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, handleDelete }) => {
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        header: 'Tên loại phép',
        accessor: 'off_work_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <span className='bw_sticky bw_name_sticky'>{p?.off_work_name}</span>,
      },
      {
        header: 'Công ty áp dụng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.company_name}</span>,
      },
      {
        header: 'Thời gian nghỉ tối đa',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.max_day_off}</span>,
      },
      {
        header: 'Trừ phép',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          if (p?.is_sub_time_off === 1) {
            return <span>Có</span>
          }
          return <span>Không</span>
        },
      },
      {
        header: 'Ngày/Giờ',
        accessor: 'is_day',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => (
          <span className='bw_label_outline bw_label_outline_success text-center'>{p?.is_day ? 'Ngày' : 'Giờ'}</span>
        ),
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Trạng thái',
        classNameHeader: 'bw_text_center',
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
        permission: 'HR_OFFWORKTYPE_ADD',
        onClick: () => window._$g.rdr(`/off-work-type/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'HR_OFFWORKTYPE_EDIT',
        onClick: (p) => window._$g.rdr(`/off-work-type/edit/${p?.off_work_type_id}`),
      },

      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'HR_OFFWORKTYPE_DEL',
        onClick: (p) =>
          dispatch(
            showConfirmModal(msgError['model_error'], async () => {
              handleDelete(p.off_work_type_id);
            }),
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
      handleBulkAction={(value) => {
        dispatch(
          showConfirmModal(msgError['model_error'], async () => {
            handleDelete(value.map((item) => item.off_work_type_id));
          }),
        );
      }}
    />
  );
};

export default CustomerTable;
