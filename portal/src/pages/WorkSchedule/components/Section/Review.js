import React, { Fragment, useMemo, useState } from 'react';

import DataTable from 'components/shared/DataTable/index';
import { useFormContext } from 'react-hook-form';
import { mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWAccordion from 'components/shared/BWAccordion';
import BWButton from 'components/shared/BWButton';
import { updateReviewLevel } from 'services/work-schedule.service';
import { useAuth } from 'context/AuthProvider';
import ModalReview from '../Modal/ModalReview';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const WorkScheduleReview = ({ disabled, title, onRefresh }) => {
  const methods = useFormContext();
  const [offWorkSelected, setOffWorkSelected] = useState();
  const {
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = methods;
  const { id } = useParams();
  const onSubmitReview = async (payload) => {
    try {
      await updateReviewLevel({
        work_schedule_id: id,
        ...payload,
      }).then(() => onRefresh());
      setOffWorkSelected(null);
      showToast.success('Cập nhật duyệt thành công');
    } catch (error) {
      showToast.error(error.message);
    }
  };

  const { user } = useAuth();

  const pending = 2;
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => {
          return index + 1;
        },
      },
      {
        header: 'Tên mức duyệt',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        accessor: 'work_schedule_review_level_name',
      },
      {
        header: 'Người duyệt',
        formatter: (_, index) => {
          return (
            <FormSelect
              disabled={disabled}
              field={`work_schedule_review.${index}.user_review`}
              list={mapDataOptions4SelectCustom(_.users, 'username', 'full_name')}
              validation={{
                required: 'Vui lòng chọn người duyệt cho mức này',
              }}
            />
          );
        },
      },
      {
        header: 'Trạng thái',
        hidden: !(getValues('work_schedule_id') && getValues('show_review_status')),
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => {
          if (p.is_review === pending)
            return (
              <>
                <div style={{ columnGap: 5 }} className='bw_flex bw_justify_content_center'>
                  <BWButton
                    disabled={String(p.user_review) !== user.user_name || disabled}
                    onClick={() =>
                      setOffWorkSelected(true)
                      // updateReviewLevel({
                      //   work_schedule_review_level_id: p.work_schedule_review_level_id,
                      //   is_review: 1,
                      // }).then(() => {
                      //   onRefresh();
                      //   showToast.success('Duyệt thành công');
                      // })
                    }
                    content={'Đồng ý'}
                  />
                  <BWButton
                    disabled={String(p.user_review) !== user.user_name || disabled}
                    onClick={() =>
                      updateReviewLevel({
                        work_schedule_review_level_id: p.work_schedule_review_level_id,
                        is_review: 0,
                      }).then(() => {
                        onRefresh();
                        showToast.success('Duyệt thành công');
                      })
                    }
                    content={'Từ chối'}
                    type={'danger'}
                  />
                </div>
              </>
            );

          return p.is_review ? (
            <span className='bw_label_outline bw_label_outline_success text-center mt-10'>Đã duyệt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger bw_mw_2 text-center mt-10'>Không duyệt</span>
          );
        },
      },
    ],
    [watch('work_schedule_review'), watch('show_review_status')],
  );

  return (
    <Fragment>
      <BWAccordion title={title} disabled={disabled}>
        <div className='bw_col_12'>
          <DataTable columns={columns} data={watch('work_schedule_review')} noPaging={true} noSelect={true} />
        </div>
      </BWAccordion>
      {offWorkSelected && <ModalReview onSubmit={onSubmitReview} onClose={() => setOffWorkSelected(null)} />}
    </Fragment>
  );
};
export default WorkScheduleReview;
