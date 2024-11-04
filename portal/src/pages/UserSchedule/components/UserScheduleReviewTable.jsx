import { Alert } from 'antd';
import DataTable from 'components/shared/DataTable/index';
import React, { useCallback, useMemo, useState } from 'react';
import { updateReview } from '../helpers/call-api';
import { showToast } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';
import useQueryString from 'hooks/use-query-string';
import { useAuth } from 'context/AuthProvider';
import BWButton from 'components/shared/BWButton';

const UserScheduleReviewTable = ({ data, onRefresh }) => {
  const { watch } = useFormContext();
  const [isAutoReview, setIsAutoReview] = useState(false);
  const [query] = useQueryString();
  const { user } = useAuth();
  const handleClickReview = useCallback(({ shift_review_id, review_note }, is_review) => {
    updateReview({ shift_review_id, note: review_note, is_review, schedule_id: query?.schedule_id })
      .then(() => {
        onRefresh();
        showToast.success('Cập nhật duyệt thành công !');
      })
      .catch((err) => showToast.error('Cập nhật duyệt thất bại'));
  }, []);
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Phòng ban',
        accessor: 'department_review_name',
        classNameHeader: ' bw_text_center',
      },
      {
        header: 'Người duyệt',
        accessor: 'user_review',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ghi chú duyệt',
        accessor: 'review_note',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trạng thái duyệt',
        accessor: 'is_review',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center bw_sticky',
        formatter: (p, index) => {
          if (p?.is_review === 3) {
            setIsAutoReview(true);
            return <span className='bw_label_outline bw_label_outline_success text-center'>Tự động duyệt</span>;
          }

          if (p?.is_review === 2) {
            p.review_note = watch(`review_list.${index}.review_note`);
            const isValidReview = user.user_name === p.user_review?.split('-')?.[0]?.trim();
            return isValidReview ? (
              <div style={{ columnGap: 5 }} className='bw_flex bw_justify_content_center'>
                <BWButton onClick={() => handleClickReview(p, 1)} content={'Duyệt'} />
                <BWButton onClick={() => handleClickReview(p, 0)} content={'Từ chối'} type={'danger'} />
              </div>
            ) : (
              <></>
            );
          }

          return p?.is_review == 1 ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Đã duyệt</span>
          ) : p?.is_review == 2 ? (
            <span className='bw_label_outline text-center'>Chưa duyệt</span>
          ) : p?.is_review == 3 ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Tự động duyệt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Không duyệt</span>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      {isAutoReview ? (
        <Alert
          message='Hình thức tự động duyệt'
          description='Đối với hình thức tự động duyệt, sẽ không cần người duyệt phiếu.'
          type='info'
          showIcon
        />
      ) : (
        <DataTable noSelect={true} noPaging={true} columns={columns} data={data} />
      )}
    </>
  );
};

export default UserScheduleReviewTable;
