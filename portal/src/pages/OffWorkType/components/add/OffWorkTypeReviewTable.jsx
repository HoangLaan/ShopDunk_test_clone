import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import { useFormContext, useFieldArray } from 'react-hook-form';
import ItemReview from './ItemReview';
import ErrorMessage from '../../../../components/shared/BWFormControl/ErrorMessage';

function OffWorkTypeReviewTable({ disabled, offworkRLOptions }) {
  const methods = useFormContext();
  const {
    watch,
    formState: { errors },
    control,
    setValue,
    clearErrors,
  } = methods;


  const validateReviews = (field) => {
    if (watch('is_auto_review')) {
      return '';
    }
    if (!field || field.length === 0) {
      return 'Vui lòng thêm mức duyệt';
    }
    const checkReviewLevelId = field.findIndex((item, index) => {
      return item.offwork_review_level_id == null;
    });
    if (checkReviewLevelId !== -1) {
      return `Vui lòng chọn mức duyệt dòng thứ ${checkReviewLevelId + 1}`;
    }
    const checkUsers = field.findIndex((item, index) => {
      return !item.users.length && !item.is_auto_review;
    });
    if (checkUsers !== -1) {
      return `Vui lòng chọn người duyệt dòng thứ ${checkUsers + 1}`;
    }
    const checkCompleted = field.findIndex((x) => x.is_complete_review);
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
    name: 'offwork_type_review_list',
    rules: {
      required: false,
      validate: (field) => {
        let msg = validateReviews(field);
        if (msg) return msg;
        else {
          if (errors['offwork_type_review_list']) {
            clearErrors('offwork_type_review_list')
          }
        }
      },
    },
  });

  const handleAddReview = () => {
    let _reviews = [...(watch('offwork_type_review_list') || [])];
    let checkReview = (watch('offwork_type_review_list') || []).find(
      (p) => !p?.offwork_review_level_id || (!p?.is_auto_review && !p?.users.length),
    );
    if (!checkReview || !_reviews.length) {
      resetIsCompleted();
      insert(_reviews.length + 1, {
        is_auto_review: false,
        offwork_review_level_id: null,
        users: [],
        is_complete_review: true,
      });
    }
  };

  const resetIsCompleted = (index = 0) => {
    let _reviews = [...(watch('offwork_type_review_list') || [])];
    _reviews = _reviews.map((p, i) => {
      return {
        ...p,
        is_complete_review: index ? (i != index ? false : p?.is_complete_review) : false,
      };
    });
    setValue('offwork_type_review_list', _reviews);
  };


  return (
    <React.Fragment>
      <table className='bw_table'>
        <thead>
          <tr>
            <th className='bw_text_center'>STT</th>
            <th>Mức duyệt</th>
            <th>Người duyệt</th>
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
                  optionsReviewLevel={offworkRLOptions}
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
      {errors['offwork_type_review_list'] && <ErrorMessage message={errors?.offwork_type_review_list?.root?.message} />}
      {!disabled && watch('company_id') ? (
        <a data-href='' className='bw_btn_outline bw_btn_outline_success bw_add_us' onClick={handleAddReview}>
          <span className='fi fi-rr-plus'></span> Thêm
        </a>
      ):null}
    </React.Fragment>
  );
}

export default OffWorkTypeReviewTable;
