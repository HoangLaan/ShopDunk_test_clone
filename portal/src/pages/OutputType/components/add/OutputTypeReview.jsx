import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import ItemReview from './ItemReview';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

function OutputTypeReview({ disabled, optionsReviewLevel = [], departmentOpts = [] }) {
  const methods = useFormContext();
  const {
    watch,
    formState: { errors },
    control,
    setValue,
    clearErrors,
  } = methods;

  const validateReviews = (field) => {
    if (!field || field.length === 0) {
      return 'Vui lòng thêm mức duyệt';
    }
    const checkReviewLevelId = field.findIndex((item, index) => {
      return item.price_review_level_id == null;
    });
    if (checkReviewLevelId !== -1) {
      return `Vui lòng chọn mức duyệt dòng thứ ${checkReviewLevelId + 1}`;
    }
    const checkDepartment = field.findIndex((item, index) => {
      return !item.department_id;
    });
    if (checkDepartment !== -1) {
      return `Vui lòng chọn phòng ban dòng thứ ${checkDepartment + 1}`;
    }
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
    return '';
  };

  const { fields, update, remove, insert } = useFieldArray({
    control,
    name: 'reviews',
    rules: {
      required: false,
      validate: (field) => {
        let msg = validateReviews(field);
        if (msg) return msg;
        else {
          if (errors['reviews']) {
            clearErrors('reviews');
          }
        }
      },
    },
  });

  const handleAddReview = () => {
    let _reviews = [...(watch('reviews') || [])];
    let checkReview = (watch('reviews') || []).find(
      (p) => !p?.price_review_level_id || (!p?.is_auto_reviewed && !p?.users.length),
    );
    if (!checkReview || !_reviews.length) {
      resetIsCompleted();
      insert(_reviews.length + 1, {
        is_auto_reviewed: false,
        price_review_level_id: null,
        users: [],
        is_completed_reviewed: true,
      });
    }
  };

  const resetIsCompleted = (index = 0) => {
    let _reviews = [...(watch('reviews') || [])];
    _reviews = _reviews.map((p, i) => {
      return {
        ...p,
        is_completed_reviewed: index ? (parseInt(i) !== parseInt(index) ? false : p?.is_completed_reviewed) : false,
      };
    });
    setValue('reviews', _reviews);
  };

  return (
    <BWAccordion title='Thông tin mức duyệt' id='bw_info_cus' isRequired>
      {!disabled && (
        <div style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '1em' }}>
          <a data-href='' className='bw_btn_outline bw_btn_outline_success' onClick={handleAddReview}>
            <span className='fi fi-rr-plus'></span> Thêm
          </a>
        </div>
      )}
      <table className='bw_table'>
        <thead>
          <tr>
            <th className='bw_text_center'>STT</th>
            <th className='bw_text_center'>Mức duyệt</th>
            <th className='bw_text_center'>Phòng ban</th>
            <th className='bw_text_center'>Người duyệt</th>
            <th className='bw_text_center'>Tự động duyệt</th>
            <th className='bw_text_center'>Mức duyệt cuối</th>
            <th className='bw_text_center'>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {fields && fields.length ? (
            fields.map((p, i) => {
              return (
                <ItemReview
                  key={p.id}
                  index={i}
                  disabled={disabled}
                  optionsReviewLevel={optionsReviewLevel}
                  departmentOpts={departmentOpts}
                  item={p}
                  update={update}
                  insert={insert}
                  remove={remove}
                  resetIsCompleted={resetIsCompleted}
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
      {errors['reviews'] && <ErrorMessage message={errors?.reviews?.root?.message} />}
    </BWAccordion>
  );
}

export default OutputTypeReview;
