import { showConfirmModal } from 'actions/global';
import BWButton from 'components/shared/BWButton';
import DataTable from 'components/shared/DataTable/index';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTimeKeepingClaim, getDetailTimeKeepingClaim, updateReview } from 'services/time-keeping-claim.service';
import ModalReview from './ReviewLevel/ModalReview';
import { showToast } from 'utils/helpers';
import { useAuth } from 'context/AuthProvider';
import { updateTimeKeeping } from 'pages/TimeKeeping/helpers/call-api';

const TimeKeepingClaimTable = ({
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
  const [isShowModalReview, setIsShowModalReview] = useState(false);
  const [timeKeepingClaimIdReview, setTimeKeepingClaimIdReview] = useState();
  const [dataTimeKeepingClaimDetail, setDataTimeKeepingClaimDetail] = useState();

  useEffect(() => {
    if (timeKeepingClaimIdReview) {
      getDetailTimeKeepingClaim(timeKeepingClaimIdReview).then((value) => {
        setDataTimeKeepingClaimDetail(value)
      });
    } 
  }, [timeKeepingClaimIdReview]);

  const { user } = useAuth();
  const pending = 2,
    empty = 3;
  const columns = useMemo(
    () => [
      {
        header: 'Nhân viên giải trình',
        classNameHeader: ' bw_text_center',
        formatter: (d) => `${d.user_name} - ${d.full_name}`,
      },
      {
        header: 'Cửa hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'store_name',
      },
      {
        header: 'Loại giải trình',
        classNameHeader: 'bw_text_center',
        accessor: 'time_keeping_claim_type_name',
      },
      {
        header: 'Ca làm việc',
        classNameHeader: 'bw_text_center',
        accessor: 'shift_name',
      },
      {
        header: 'Ngày công giải trình',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'shift_date',
      },
      {
        header: 'Trạng thái duyệt',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          const is_reviewed = p.is_reviewed;
          if (is_reviewed === empty) return <span class='bw_label_outline text-center mt-10'>Chờ duyệt</span>;
          if (is_reviewed === pending)
            return <span class='bw_label_outline bw_label_outline_warning text-center mt-10'>Đang duyệt</span>;

          return is_reviewed ? (
            <span class='bw_label_outline bw_label_outline_success bw_mw_2 text-center mt-10'>Đã duyệt</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center mt-10'>Không duyệt</span>
          );
        },
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

  const handleCloseModalReview = useCallback(() => {
    setTimeKeepingClaimIdReview(null);
    setIsShowModalReview(false);
  }, []);

  const onSubmitReview = useCallback(
    async (payload) => {
      try {
        const dataSubmit = {
          shift_date: dataTimeKeepingClaimDetail?.shift_date,
          shift_id: dataTimeKeepingClaimDetail?.shift_id,
          user_name: dataTimeKeepingClaimDetail?.user_name,
          time_start: dataTimeKeepingClaimDetail?.time_start,
          time_end: dataTimeKeepingClaimDetail?.time_end,
          time_keeping_id: dataTimeKeepingClaimDetail?.time_keeping_id,
          is_over_time: dataTimeKeepingClaimDetail?.is_over_time,
          shift_name: dataTimeKeepingClaimDetail?.shift_name
        }
        await updateReview({
          time_keeping_claim_id: timeKeepingClaimIdReview,
          ...payload,
        });
        if (payload?.is_reviewed === 1) {
          await updateTimeKeeping(dataSubmit)
        }
        onRefresh();
        showToast.success(`Cập nhật duyệt thành công`);
        setIsShowModalReview(false);
      } catch (error) {
        showToast.error(error.message ?? `Cập nhật duyệt thất bại`);
      }
    },
    [timeKeepingClaimIdReview, dataTimeKeepingClaimDetail],
  );

  const actions = useMemo(() => {
    return [
      //Disable nút Duyệt màn list
      // {
      //   icon: 'fa fa-check-square',
      //   color: 'blue',
      //   hidden: (p) =>
      //     (p.is_reviewed !== pending && p.is_reviewed !== empty) || !p.users_review?.includes(user.user_name),
      //   permission: 'HR_TIMEKEEPINGCLAIM_REVIEW',
      //   onClick: (p) => {
      //     setTimeKeepingClaimIdReview(p.time_keeping_claim_id);
      //     setIsShowModalReview(true);
      //   },
      // },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        hidden: (p) => p.is_reviewed !== pending && p.is_reviewed !== empty,
        onClick: (p) => {
          window._$g.rdr(`/time-keeping-claim/edit/${p?.time_keeping_claim_id}`);
        },
        permission: 'HR_TIMEKEEPINGCLAIM_EDIT',
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        onClick: (p) => window._$g.rdr(`/time-keeping-claim/detail/${p?.time_keeping_claim_id}`),
        permission: 'HR_TIMEKEEPINGCLAIM_VIEW',
      },
      {
        icon: 'fi fi-rr-trash',
        permission: 'HR_TIMEKEEPINGCLAIM_DEL',
        color: 'red',
        hidden: (p) => p.is_reviewed !== pending && p.is_reviewed !== empty,
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteTimeKeepingClaim(p?.time_keeping_claim_id);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

  return (
    <>
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
        handleBulkAction={(e) => {
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteTimeKeepingClaim(e.map((o) => o.time_keeping_claim_id)?.join(','));

                onRefresh();
              },
            ),
          );
        }}
      />

      {isShowModalReview && (
        <ModalReview
          onSubmit={onSubmitReview}
          onClose={handleCloseModalReview}
          isShowModalReview={isShowModalReview}
        />
      )}
    </>
  );
};

export default TimeKeepingClaimTable;
