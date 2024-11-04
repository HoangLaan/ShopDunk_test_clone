import React, { Fragment, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { isArray } from 'lodash';
import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';
import { deleteById, updateReviewLevel } from 'services/work-schedule.service';
import { useAuth } from 'context/AuthProvider';
import { showToast } from 'utils/helpers';
import ModalReview from './Modal/ModalReview';

const COLUMN_ID = 'work_schedule_id';
const WorkScheduleTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [offWorkSelected, setOffWorkSelected] = useState();

  const pending = 2;
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (_, i) => {
          return i + 1;
        },
      },
      {
        header: 'Tên công việc',
        accessor: 'work_schedule_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Loại lịch công tác',
        accessor: 'work_schedule_type_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Nhân viên đăng ký',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Bắt đầu',
        accessor: 'start_time',
        classNameHeader: 'bw_text_center',
        formatter: (item) => {
          return <span>{moment.utc(item.start_time).format('HH:00 A DD/MM/YYYY')}</span>;
        },
      },
      {
        header: 'Kết thúc',
        accessor: 'end_time',
        classNameHeader: 'bw_text_center',
        formatter: (item) => {
          return <span>{moment.utc(item.end_time).format('HH:00 A DD/MM/YYYY')}</span>;
        },
      },
      {
        header: 'Trạng thái duyệt',
        classNameHeader: 'bw_text_center',
        formatter: (p) => {
          return isArray(p.review_info)
            ? p.review_info.map((item) => {
                return (
                  <div>
                    <span style={{ marginRight: '6px' }}>{item?.user_review}</span>
                    {item.is_review === 1 ? (
                      <span class='bw_label_outline bw_label_outline_success bw_mw_2 text-center mt-10'>Đã duyệt</span>
                    ) : item.is_review === 0 ? (
                      <span class='bw_label_outline bw_label_outline_danger text-center mt-10'>Không duyệt</span>
                    ) : (
                      <span class='bw_label_outline bw_label_outline_warning text-center mt-10'>Chưa duyệt</span>
                    )}
                  </div>
                );
              })
            : null;
        },
      },
      {
        header: 'Kích hoạt',
        accessor: 'is_active',
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

  const onSubmitReview = async (payload) => {
    try {
      await updateReviewLevel({
        work_schedule_id: offWorkSelected?.work_schedule_id,
        ...payload,
      }).then(() => onRefresh());
      setOffWorkSelected(null);
      showToast.success('Cập nhật duyệt thành công');
    } catch (error) {
      showToast.error(error.message);
    }
  };

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm mới',
        permission: 'HR_WORKSCHEDULE_ADD',
        onClick: () => window._$g.rdr('/work-schedule/add'),
      },
      {
        hidden: (p) =>
          !p?.review_info?.some(
            (item) => item.is_review === pending && item.user_review?.split('-')?.[0]?.trim() === user.user_name,
          ),
        icon: 'fa fa-check-square',
        color: 'blue',
        permission: 'HR_WORKSCHEDULE_REVIEW',
        onClick: (p) => {
          console.log(p);
          setOffWorkSelected({
            ...p.review_info?.find((item) => item.user_review?.split('-')?.[0]?.trim() === user.user_name),
            work_schedule_id: p.work_schedule_id,
          });
        },
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: 'HR_WORKSCHEDULE_EDIT',
        onClick: (p) => window._$g.rdr(`/work-schedule/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        permission: 'HR_WORKSCHEDULE_VIEW',
        onClick: (p) => window._$g.rdr(`/work-schedule/detail/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: 'HR_WORKSCHEDULE_DEL',
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteById([p?.[COLUMN_ID]]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <Fragment>
      <DataTable
        fieldCheck={COLUMN_ID}
        loading={loading}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        noSelect={true}
        totalItems={totalItems}
        onChangePage={onChangePage}
      />
      {offWorkSelected && <ModalReview onSubmit={onSubmitReview} onClose={() => setOffWorkSelected(null)} />}
    </Fragment>
  );
};

export default WorkScheduleTable;
