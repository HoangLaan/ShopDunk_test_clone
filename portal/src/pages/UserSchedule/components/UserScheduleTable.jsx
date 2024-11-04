import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDispatch } from 'react-redux';
import { msgError } from '../helpers/msgError';
import { showConfirmModal } from 'actions/global';
import { useAuth } from 'context/AuthProvider';
import { showToast } from 'utils/helpers';

dayjs.extend(customParseFormat);

const UserScheduleTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleDelete,
  loading,
  setReviewPayload,
  setIsShowModalReview,
  handleExportExcel,
  handleExportExcelSchedule,
  refreshFlag
}) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const columns = useMemo(
    () => [
      {
        header: 'Nhân viên',
        accessor: 'user_fullname',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.user_fullname}</b>,
      },
      {
        header: 'Cửa hàng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <p>{p?.store_name}</p>,
      },
      {
        header: 'Ca làm việc',
        accessor: 'shift_name',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <p>{p?.shift_name}</p>,
      },
      {
        header: 'Ngày làm việc',
        accessor: 'shift_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span className='text-center'>{p?.shift_date}</span>,
      },
      {
        header: 'Trạng thái',
        accessor: 'is_review',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center bw_sticky',
        formatter: (p) =>
          p?.is_review == 1 ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Đã duyệt</span>
          ) : p?.is_review == 2 ? (
            <span className='bw_label_outline bw_label_outline_warning text-center'>Đang duyệt</span>
          ) : p?.is_review == 4 ? (
            <span className='bw_label_outline text-center'>Chờ duyệt</span>
          ) : p?.is_review == 3 ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Tự động duyệt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Không duyệt</span>
          ),
      },
      {
        header: 'Ngày tạo',
        accessor: 'date_create',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
      },
    ],
    [],
  );

  const pending = 2,
    auto_review = 3;

  const handleBulkAction = (items, action) => {
    const checkCondition = items.some(el => el.is_can_edit === 0);
    if (items?.length > 0 && action === 'delete' && !checkCondition) {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
          handleDelete(items.filter(el => el.is_can_edit))
        ),
      )
    } else {
      showToast.error('Dữ liệu bạn chọn có ca làm việc không thể xóa!');
    }
  };

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out',
        type: 'success',
        content: 'Xuất excel',
        permission: 'HR_USER_SCHEDULE_EXPORT',
        onClick: () => handleExportExcelSchedule(),
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out',
        type: 'success',
        content: 'Xuất excel ca hỗ trợ',
        permission: 'MD_SHIFT_SUPPORT_EXPORT',
        onClick: () => handleExportExcel(),
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'HR_USER_SCHEDULE_ADD',
        onClick: () => window._$g.rdr(`/user-schedule/add`),
      },
      {
        icon: 'fi fi-rr-check',
        color: 'red',
        permission: 'HR_USER_SCHEDULE_REVIEW',
        hidden: (p) =>
          ![pending, auto_review].includes(p?.is_review) ||
          !p.is_overtime ||
          !p.user_review_list
            ?.split('|')
            ?.map((item) => item.split('#')[0])
            ?.includes(user.user_name),
        onClick: (p) => {
          setIsShowModalReview(true);
          setReviewPayload({ schedule_id: p.schedule_id });
        },
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'HR_USER_SCHEDULE_EDIT',
        hidden: (p) => !p?.is_can_edit,
        onClick: (p) => {
          window._$g.rdr(
            `/user-schedule/edit/?store_id=${p?.store_id}&shift_id=${p?.shift_id}&user_name=${p?.user_name}&shift_date=${p?.shift_date}&schedule_id=${p?.schedule_id}`,
          );
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'HR_USER_SCHEDULE',
        onClick: (p) =>
          window._$g.rdr(
            `/user-schedule/detail/?store_id=${p?.store_id}&shift_id=${p?.shift_id}&user_name=${p?.user_name}&shift_date=${p?.shift_date}&schedule_id=${p?.schedule_id}`,
          ),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'HR_USER_SCHEDULE_DELETE',
        hidden: (p) => !p?.is_can_edit,
        onClick: (p) => {
          dispatch(
            showConfirmModal(msgError['model_error'], async () => {
              handleDelete(p);
            }),
          );
        },
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
      handleBulkAction={handleBulkAction}
      refreshFlag={refreshFlag}
      //hiddenRowSelect={(p) => !p?.is_can_edit || p?.is_review == 1 || p?.is_review == 3}
      // hiddenDeleteClick={true}
    />
  );
};

export default UserScheduleTable;
