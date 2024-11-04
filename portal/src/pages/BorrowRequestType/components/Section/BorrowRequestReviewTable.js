import React, {useCallback, useEffect, useState} from 'react';
import {useFormContext, useFieldArray} from 'react-hook-form';
import ItemReview from './ItemReview';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import BorrowRequestAddModal from "./BorrowRequestAddModal";
import {getListBorrowReviewLv} from "services/borrow-request-rl.service";
import {useAuth} from "context/AuthProvider";

function BorrowReviewTable({disabled}) {
  const {user}=useAuth()
  const companyId=user.company_id

  const methods = useFormContext();
  const [showModalAdd, setShowModalAdd] = useState({
    isOpen: false,
    isEdit: false,
  });
  const {
    watch,
    formState: {errors},
    control,
    setValue,
    clearErrors,
  } = methods;

  const [listReviewLevel, setListReviewLevel] = useState([])
  const getListReview = useCallback(() => {
  if(companyId)
    getListBorrowReviewLv({"company_id": companyId}).then((res) => {
      setListReviewLevel(res.items)
    })
  }, [companyId]);

  useEffect(getListReview, [getListReview]);

  const validateReviews = (field) => {
    if (watch('is_auto_review')) {
      return '';
    }
    if (!field || field.length === 0) {
      return 'Vui lòng thêm mức duyệt';
    }
    const checkReviewLevelId = field.findIndex((item, index) => {
      return item.borrow_review_level_id == null;
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

    const checkCompleted = field.findIndex((x) => x.is_complete_review);
    if (checkCompleted < 0) {
      return 'Mức duyệt cuối là bắt buộc';
    }
    if (checkCompleted < field.length - 1) {
      return 'Mức duyệt cuối phải là dòng cuối cùng';
    }
    return '';
  };

  const {fields, update, remove, insert} = useFieldArray({
    control,
    name: 'borrow_type_review_list',
    rules: {
      required: false,
      validate: (field) => {
        let msg = validateReviews(field);
        if (msg) return msg;
        else {
          if (errors['borrow_type_review_list'])
            clearErrors('borrow_type_review_list')
        }
      },
    },
  });

  const handleAddReview = () => {
    let _reviews = [...(watch('borrow_type_review_list') || [])];
    let checkReview = (watch('borrow_type_review_list') || []).find(
      (p) => !p?.borrow_review_level_id || (!p?.is_auto_review && !p?.user),
    );
    if (!checkReview || !_reviews.length) {
      resetIsCompleted();
      insert(_reviews.length + 1, {
        is_auto_review: false,
        borrow_review_level_id: null,
        user: null,
        is_complete_review: true,
      });
    }

  };

  const resetIsCompleted = (index = 0) => {
    let _reviews = [...(watch('borrow_type_review_list') || [])];
    _reviews = _reviews.map((p, i) => {
      return {
        ...p,
        is_complete_review: index ? (i != index ? false : p?.is_complete_review) : false,
      };
    });
    setValue('borrow_type_review_list', _reviews);
  };

  return (
    <React.Fragment>
      <div className='bw_flex  bw_justify_content_right bw_mb_1'>
        {!disabled && companyId ? <a data-href='' className='bw_btn_outline bw_btn_outline_success bw_add_us'
           onClick={!disabled ? () => setShowModalAdd({isOpen: true, isEdit: true}) : () => {
           }}>
          <span className='fi fi-rr-plus'></span> Thêm mức duyệt mới
        </a>:null}
      </div>
      <table className='bw_table'>
        <thead>
        <tr>
          <th className='bw_text_center'>STT</th>
          <th className='bw_text_center'>Tên mức duyệt</th>
          <th className='bw_text_center'>Tự động duyệt</th>
          <th className='bw_text_center'>Người duyệt</th>
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
      {errors['borrow_type_review_list'] && <ErrorMessage message={errors?.borrow_type_review_list?.root?.message}/>}
      {!disabled && listReviewLevel.length? (
        <a data-href='' className='bw_btn_outline bw_btn_outline_success bw_add_us' onClick={handleAddReview}>
          <span className='fi fi-rr-plus'></span> Thêm
        </a>
      ) : null}
      {showModalAdd.isOpen && companyId && (
        <BorrowRequestAddModal onRefresh={getListReview} companyId={companyId} listReview={listReviewLevel}  setShowModalAdd={setShowModalAdd}/>
      )}
    </React.Fragment>
  );
}

export default BorrowReviewTable;
