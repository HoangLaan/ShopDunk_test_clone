import DataTable from 'components/shared/DataTable/index';
import React, { Fragment, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deleteTaskWorkflow } from 'services/task-work-flow.service';
import ActionTask from './ActionTask';
import { TASK_PERMISSION } from 'pages/Task/utils/const';
import { deleteTask } from 'services/task.service';
import ColumnCheckbox from '../shares/ColumnCheckbox';

const TaskTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onChange,
  onRefresh,
  params,
}) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: ' bw_name_sticky bw_text_center',
        classNameBody: ' bw_name_sticky',
        formatter: (item, index) => index + 1,
      },
      {
        header: 'Tên công việc',
        accessor: 'task_name',
        classNameHeader: ' bw_name_sticky bw_text_center',
        classNameBody: ' bw_name_sticky',
      },
      {
        header: 'Loại công việc',
        accessor: 'task_type_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày bắt đầu',
        accessor: 'start_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Ngày kết thúc',
        accessor: 'end_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Nhân viên xử lý',
        accessor: 'staff_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Nhân viên giám sát',
        accessor: 'supervisor_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Đã hoàn thành CSKH',
        accessor: 'create_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item) => `${item.total_customer_complete || 0}/${item.total_customer || 0}`,
      },
      {
        header: 'Đã hoàn thành',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item) => <ColumnCheckbox checked={item.is_complete === 1} />,
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
        content: 'Thêm mới',
        icon: 'fi fi-rr-plus',
        color: 'success',
        onClick: (p) => window._$g.rdr(`/task/add`),
        permission: TASK_PERMISSION.ADD,
      },
      {
        icon: 'fa fa-list-ul',
        color: 'warning',
        permission: TASK_PERMISSION.VIEW_CUSTOMER,
        onClick: (p) => window._$g.rdr(`/task/customer/${p?.task_id}`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: TASK_PERMISSION.EDIT,
        onClick: (p) => window._$g.rdr(`/task/edit/${p?.task_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: TASK_PERMISSION.DEL,
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteTask([_?.task_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

  return (
    <Fragment>
      <ActionTask params={params} actions={actions} onChange={onChange} totalItems={totalItems} data={data} />
      <DataTable
        hiddenDeleteClick
        noSelect
        loading={loading}
        columns={columns}
        data={data}
        actions={actions.filter((x) => !x.globalAction)}
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
                await deleteTaskWorkflow(e?.map((val) => parseInt(val?.task_id)));
                onRefresh();
              },
            ),
          );
        }}
      />
    </Fragment>
  );
};

export default TaskTable;
