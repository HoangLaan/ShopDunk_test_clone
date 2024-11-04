import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deleteWorkScheduleType } from 'services/work-schedule-type.service';

const WorkScheduleTypeTable = ({
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
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_center',
        formatter: (d, i) => i + 1,
      },
      {
        header: 'Tên loại lịch công tác',
        accessor: 'work_schedule_type_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Tự động duyệt',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (d) => <p>{d.is_auto_review ? 'Có' : 'Không'}</p>,
      },
      {
        header: 'Mô tả',
        accessor: 'description',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Kích hoạt',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Có</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Không</span>
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
        permission: 'HR_WORKSCHEDULETYPE_ADD',
        onClick: () => window._$g.rdr(`/work-schedule-type/add`),
      },

      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'HR_WORKSCHEDULETYPE_EDIT',
        onClick: (p) => window._$g.rdr(`/work-schedule-type/edit/${p?.work_schedule_type_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'HR_WORKSCHEDULETYPE_VIEW',
        onClick: (p) => window._$g.rdr(`/work-schedule-type/detail/${p?.work_schedule_type_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'HR_WORKSCHEDULETYPE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteWorkScheduleType([_?.work_schedule_type_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

  return (
    <DataTable
      noSelect={true}
      loading={loading}
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
              await deleteWorkScheduleType(e?.map((val) => parseInt(val?.work_schedule_type_id)));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default WorkScheduleTypeTable;
