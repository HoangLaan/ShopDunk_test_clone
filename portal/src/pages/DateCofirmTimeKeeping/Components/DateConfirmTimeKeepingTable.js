import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
// Services
import { deleteTimeKeepingDateConfirm } from '../helpers/call-api';
import { Tooltip } from 'antd';

const DateConfirmTimeKeepingTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
}) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên ngày khóa xác nhận công',
        accessor: 'time_keeping_confirm_date_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky bw_title_page',
        formatter: (p) => {
          let name = p?.time_keeping_confirm_date_name;
          return (
            <Tooltip title={name}>
              <div>{name.length > 20 ? `${name?.slice(0, 20)}...` : name}</div>
            </Tooltip>
          );
        },
      },
      {
        header: 'Ngày bắt đầu',
        accessor: 'date_from',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Ngày kết thúc',
        accessor: 'date_to',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Tính công',
        accessor: 'is_apply_work_day',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_apply_work_day ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Có</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Không</span>
          ),
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
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'MD_TIMEKEEPINGCONFIRMDATE_ADD',
        onClick: () => window._$g.rdr(`/date-confirm-time-keeping/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'MD_TIMEKEEPINGCONFIRMDATE_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/date-confirm-time-keeping/edit/${p?.time_keeping_confirm_date_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'MD_TIMEKEEPINGCONFIRMDATE_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/date-confirm-time-keeping/detail/${p?.time_keeping_confirm_date_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'MD_TIMEKEEPINGCONFIRMDATE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete(`${_.time_keeping_confirm_date_id}`),
            ),
          ),
      },
    ];
  }, []);

  const handleDelete = async (arr) => {
    await deleteTimeKeepingDateConfirm({ list_id: arr });
    onRefresh();
  };

  const handleBulkAction = (items, action) => {
    let arrDel = items?.map((item) => item?.time_keeping_confirm_date_id)?.join(',');
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
          handleDelete(arrDel);
          // (items || []).forEach((item) => {
          //   handleDelete(item.solution_id);
          // });
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

export default DateConfirmTimeKeepingTable;
