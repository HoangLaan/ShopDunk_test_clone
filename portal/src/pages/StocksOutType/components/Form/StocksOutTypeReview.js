import React, { useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { mapDataOptions4Select } from '../../../../utils/helpers';
import { showToast } from 'utils/helpers';
import ErrorMessage from '../../../../components/shared/BWFormControl/ErrorMessage';
import ItemReviewOut from './ItemReviewOut';
import BWAccordion from '../../../../components/shared/BWAccordion/index';
import { getListStocksOutReviewOptions } from '../../helpers/call-api';

const StocksOutTypeReview = ({ disabled, title, id }) => {
  const methods = useFormContext();
  const {
    watch,
    formState: { errors },
    control,
    setValue,
    clearErrors,
  } = methods;
  const [stocksOutReviewOpts, setStocksOutReviewOpts] = useState([]);

  const getStocksInReviewOption = async () => {
    try {
      let data = await getListStocksOutReviewOptions({ stocks_type: 2 });
      setStocksOutReviewOpts(mapDataOptions4Select(data));
    } catch (error) {
      showToast.error('Có lỗi xảy ra!');
    }
  };

  useEffect(() => {
    getStocksInReviewOption();
  }, []);

  const validateReviews = (field) => {
    if (watch('is_auto_review')) {
      return '';
    }
    if (!field || field.length === 0) {
      return 'Vui lòng thêm mức duyệt';
    }
    const checkReviewLevelId = field.findIndex((item, index) => {
      return item.stocks_review_level_id == null;
    });
    if (checkReviewLevelId !== -1) {
      return `Vui lòng chọn mức duyệt dòng thứ ${checkReviewLevelId + 1}`;
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

    const checkExistUsers = field.filter((item) => item.users.length > 0);

    if (!checkExistUsers || checkExistUsers.length === 0) {
      return 'Vui lòng chọn 1 mức duyệt có người duyệt';
    }

    return '';
  };

  const { fields, update, remove, insert } = useFieldArray({
    control,
    name: 'stocks_out_review_level_list',
    rules: {
      required: false,
      validate: (field) => {
        let msg = validateReviews(field);

        if (msg) return msg;
        else {
          if (errors['stocks_out_review_level_list']) {
            clearErrors('stocks_out_review_level_list');
          }
        }
      },
    },
  });

  const handleAddReview = () => {
    let _reviews = [...(watch('stocks_out_review_level_list') || [])];
    let checkReview = (watch('stocks_out_review_level_list') || []).find(
      (p) => !p?.stocks_review_level_id || (!p?.is_auto_reviewed && !p?.users.length),
    );
    if (!checkReview || !_reviews.length) {
      resetIsCompleted();
      insert(_reviews.length + 1, {
        is_auto_reviewed: false,
        stocks_review_level_id: null,
        users: [],
        is_completed_reviewed: 1,
      });
    }
  };

  const resetIsCompleted = (index = 0) => {
    let _reviews = [...(watch('stocks_out_review_level_list') || [])];
    _reviews = _reviews.map((p, i) => {
      return {
        ...p,
        is_completed_reviewed: index ? (i != index ? false : p?.is_completed_reviewed) : false,
      };
    });
    setValue('stocks_out_review_level_list', _reviews);
  };

  return (
    <BWAccordion title={title} id={id} isRequired>
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
            <th className='bw_text_center'>Mức duyệt</th>
            <th className='bw_text_center'>Người duyệt</th>
            <th className='bw_text_center'>Tự động duyệt</th>
            <th className='bw_text_center'>Mức duyệt cuối</th>
            <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>
          </thead>
          <tbody>
            {fields && fields.length ? (
              fields.map((p, index) => {
                return (
                  <ItemReviewOut
                    key={p.id}
                    index={index}
                    disabled={disabled}
                    stocksOutReviewOpts={stocksOutReviewOpts}
                    item={p}
                    update={update}
                    insert={insert}
                    remove={remove}
                    resetIsCompleted={resetIsCompleted}
                    keyUser={`stocks_out_review_level_list.${index}`}
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
      </div>
      {errors['stocks_out_review_level_list'] && (
        <ErrorMessage message={errors?.stocks_out_review_level_list?.root?.message} />
      )}

      {disabled ? null : (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a data-href className='bw_btn_outline bw_btn_outline_success bw_add_us' onClick={handleAddReview}>
          <span className='fi fi-rr-plus'></span> Thêm
        </a>
      )}
    </BWAccordion>
  );
};

export default StocksOutTypeReview;
