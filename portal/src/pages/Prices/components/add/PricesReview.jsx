import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import ItemReview from './ItemReview';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

function PricesReview({ disabled, priceId }) {
  const methods = useFormContext();
  const {
    formState: { errors },
    control,
    clearErrors,
  } = methods;

  const validateReviews = (field) => {
    if (!methods.watch('is_many_outputs')) {
      const checkReviewLevelId = field.findIndex((item, index) => {
        return item.price_review_level_id == null;
      });
      if (checkReviewLevelId !== -1) {
        return `Vui lòng chọn mức duyệt dòng thứ ${checkReviewLevelId + 1}`;
      }
      // const checkDepartment = field.findIndex((item, index) => {
      //   return !item.department_id
      // });
      // if (checkDepartment !== -1) {
      //   return `Vui lòng chọn phòng ban dòng thứ ${checkDepartment + 1}`;
      // }
      const checkUsers = field.findIndex((item, index) => {
        return !item.users.length && !item.is_auto_reviewed;
      });
      if (checkUsers !== -1) {
        return `Vui lòng chọn người duyệt dòng thứ ${checkUsers + 1}`;
      }
      const checkCompleted = field.findIndex((x) => x.is_completed_reviewed);
      if (checkCompleted < 0) {
        return 'Mức duyệt cuối là bắt buộc.';
      }
      if (checkCompleted < field.length - 1) {
        return 'Mức duyệt cuối phải là dòng cuối cùng';
      }
    }

    return '';
  };

  const { fields, update, remove, insert } = useFieldArray({
    control,
    name: 'review_list',
    rules: {
      required: false,
      validate: (field) => {
        let msg = validateReviews(field);
        if (msg) return msg;
        else {
          if (errors['review_list']) {
            clearErrors('review_list');
          }
        }
      },
    },
  });

  return (
    <BWAccordion title='Thông tin mức duyệt' id='bw_info_cus' isRequired>
      <div className='bw_collapse_panel'>
        <table className='bw_table'>
          <thead>
            <tr>
              <th className='bw_text_center' style={{ width: 100 }}>
                STT
              </th>
              <th>Mức duyệt</th>
              <th>Phòng ban</th>
              <th>Người duyệt</th>
              {disabled ? (
                <>
                  <th className='bw_text_center' style={{ width: '20%' }}>
                    Trạng thái duyệt
                  </th>
                  <th style={{ width: '25%' }}>Nội dung duyệt</th>
                </>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {fields && fields.length ? (
              fields.map((p, i) => {
                return (
                  <ItemReview
                    key={p.price_review_level_id}
                    index={i}
                    disabled={disabled}
                    item={p}
                    update={update}
                    insert={insert}
                    remove={remove}
                    priceId={priceId}
                  />
                );
              })
            ) : (
              <tr>
                <td colSpan={50} className='bw_text_center'>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {errors['review_list'] && <ErrorMessage message={errors?.review_list?.root?.message} />}
      </div>
    </BWAccordion>
  );
}

export default PricesReview;
