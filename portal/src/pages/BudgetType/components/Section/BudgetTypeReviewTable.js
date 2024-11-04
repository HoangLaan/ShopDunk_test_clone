import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import ItemReview from './ItemReview';
import ErrorMessage from '../../../../components/shared/BWFormControl/ErrorMessage';
import BudgetTypeAddModal from './BudgetTypeAddModal';
import { getListBudgetReviewLv } from '../../../../services/budget-review-lv.service';

function BudgetReviewTable({ disabled }) {
  const methods = useFormContext();
  const [showModalAdd, setShowModalAdd] = useState({
    isOpen: false,
    isEdit: false,
  });

  const {
    watch,
    formState: { errors },
    control,
    setValue,
    getValues,
    clearErrors,
  } = methods;

  const [listReviewLevel, setListReviewLevel] = useState([]);
  const getListReview = useCallback(() => {
    getListBudgetReviewLv({ company_id: watch('company_id') }).then((res) => {
      setListReviewLevel(res.items);
    });
  }, [watch('company_id')]);

  useEffect(getListReview, [getListReview]);

  const validateReviews = (field) => {
    if (watch('is_auto_review')) {
      return '';
    }
    if (!field || field.length === 0) {
      return 'Vui lòng thêm mức duyệt';
    }
    const checkReviewLevelId = field.findIndex((item, index) => {
      return item.budget_review_level_id == null;
    });
    if (checkReviewLevelId !== -1) {
      return `Vui lòng chọn mức duyệt dòng thứ ${checkReviewLevelId + 1}`;
    }
    const checkUsers = field.findIndex((item, index) => {
      return !item.user && !item.is_auto_review;
    });
    if (checkUsers !== -1) {
      return `Vui lòng chọn người duyệt dòng thứ ${checkUsers + 1}`;
    }
    const checkBudget = field.findIndex((item, index) => {
      return (
        item.budget_level_from < 0 ||
        item.budget_level_from > 1000000000 ||
        item.budget_level_to < 0 ||
        item.budget_level_to > 1000000000
      );
    });
    if (checkBudget !== -1) {
      return 'Ngân sách phải lớn hơn 0 và không quá 1 tỷ đồng';
    }
    const checkRangeBudget = field.findIndex((item, index) => {
      return (
        !item.budget_level_to ||
        !item.budget_level_from ||
        Number(item.budget_level_to) < Number(item.budget_level_from)
      );
    });
    if (checkRangeBudget !== -1) {
      return 'Khoảng ngân sách không hợp lệ';
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
    name: 'budget_type_review_list',
    rules: {
      required: false,
      validate: (field) => {
        let msg = validateReviews(field);
        if (msg) return msg;
        else {
          if (errors['budget_type_review_list']) clearErrors('budget_type_review_list');
        }
      },
    },
  });

  const handleAddReview = () => {
    let _reviews = [...(watch('budget_type_review_list') || [])];
    let checkReview = (watch('budget_type_review_list') || []).find(
      (p) => !p?.budget_review_level_id || (!p?.is_auto_review && !p?.user),
    );
    if (!checkReview || !_reviews.length) {
      resetIsCompleted();
      insert(_reviews.length + 1, {
        is_auto_review: false,
        budget_review_level_id: null,
        user: null,
        is_complete_review: true,
      });
    }
  };

  const resetIsCompleted = (index = 0) => {
    let _reviews = [...(watch('budget_type_review_list') || [])];
    _reviews = _reviews.map((p, i) => {
      return {
        ...p,
        is_complete_review: index ? (i != index ? false : p?.is_complete_review) : false,
      };
    });
    setValue('budget_type_review_list', _reviews);
  };

  return (
    <React.Fragment>
      <div className='bw_flex  bw_justify_content_right bw_mb_1'>
        <a
          data-href=''
          className='bw_btn_outline bw_btn_outline_success bw_add_us'
          onClick={!disabled ? () => setShowModalAdd({ isOpen: true, isEdit: true }) : () => {}}>
          <span className='fi fi-rr-plus'></span> Thêm mới mức duyệt
        </a>
      </div>
      <table style={{ display: 'block', borderRadius: '0' }} className='bw_table'>
        <thead>
          <tr>
            <th className='bw_text_center'>STT</th>
            <th className='bw_text_center'>Tên mức duyệt</th>
            <th className='bw_text_center'>Tự động duyệt</th>
            <th className='bw_text_center'>Người duyệt</th>
            <th className='bw_text_center'>Phòng ban</th>
            <th className='bw_text_center'>Mức ngân sách</th>
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
                  optionsReviewLevel={listReviewLevel}
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
      {errors['budget_type_review_list'] && <ErrorMessage message={errors?.budget_type_review_list?.root?.message} />}
      {!disabled && watch('company_id') ? (
        <a data-href='' className='bw_btn_outline bw_btn_outline_success bw_add_us' onClick={handleAddReview}>
          <span className='fi fi-rr-plus'></span> Thêm dòng
        </a>
      ) : null}
      {showModalAdd.isOpen && <BudgetTypeAddModal showModalAdd={showModalAdd} setShowModalAdd={setShowModalAdd} />}
    </React.Fragment>
  );
}

export default BudgetReviewTable;
