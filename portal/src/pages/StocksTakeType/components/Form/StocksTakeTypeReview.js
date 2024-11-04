/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import BWAccordion from '../../../../components/shared/BWAccordion/index';
import { useFormContext, useFieldArray } from 'react-hook-form';
import ItemReviewTake from './ItemReviewTake';
import { mapDataOptions4Select } from '../../../../utils/helpers';
import ErrorMessage from '../../../../components/shared/BWFormControl/ErrorMessage';
import { showToast } from 'utils/helpers';
import { getListStocksTakeReviewOptions } from '../../helpers/call-api';

const StocksTakeTypeReview = ({ disabled }) => {
  const methods = useFormContext();
  const {
    watch,
    setValue,
    control,
    formState: { errors },
    clearErrors,
  } = methods;

  const validateReviews = (field) => {
    if (watch('is_stocks_take_review')) {
      return;
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
    name: 'stocks_take_review_level_list',
    rules: {
      required: false,
      validate: (field) => {
        let message = validateReviews(field);
        if (message) {
          return message;
        } else {
          if (errors['stocks_take_review_level_list']) {
            clearErrors('stocks_take_review_level_list');
          }
        }
      },
    },
  });

  const [stocksTakeReviewOpts, setStocksTakeReviewOpts] = useState([]);

  const getStocksTakeReviewOption = async () => {
    try {
      let data = await getListStocksTakeReviewOptions({ stocks_type: 3 });
      setStocksTakeReviewOpts(mapDataOptions4Select(data));
    } catch (error) {
      showToast.error('Có lỗi xảy ra!');
    }
  };

  useEffect(() => {
    getStocksTakeReviewOption();
  }, []);

  const resetIsCompleted = (index) => {
    let reviews = [...(watch('stocks_take_review_level_list') || [])];
    reviews = reviews.map((item, i) => {
      return {
        ...item,
        is_completed_reviewed: index ? (i != index ? false : item?.is_completed_reviewed) : false,
      };
    });
    setValue('stocks_take_review_level_list', reviews);
  };

  const handleAddReview = () => {
    let reviews = [...(watch('stocks_take_review_level_list') || [])];
    let checkReview = (watch('stocks_take_review_level_list') || []).find(
      (item) => !item?.stocks_review_level_id || (!item.is_auto_reviewed && !item.users.length),
    );
    if (!reviews.length || !checkReview) {
      resetIsCompleted();
      insert(reviews.length + 1, {
        is_auto_reviewed: false,
        stocks_review_level_id: null,
        users: [],
        is_completed_reviewed: 1,
      });
    }
  };

  return (
    <BWAccordion title='Thông tin mức duyệt' id='bw_info_cus' isRequired>
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
            {fields && fields.length > 0 ? (
              fields.map((item, index) => {
                return (
                  item && (
                    <ItemReviewTake
                      key={index}
                      keyUser={`stocks_take_review_level_list.${index}`}
                      item={item}
                      index={index}
                      disabled={disabled}
                      stocksTakeReviewOpts={stocksTakeReviewOpts}
                      methods={methods}
                      update={update}
                      insert={insert}
                      remove={remove}
                      resetIsCompleted={resetIsCompleted}
                    />
                  )
                );
              })
            ) : (
              <tr>
                <td colSpan={12} className='bw_text_center'>
                  Chưa thêm người duyệt
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {errors['stocks_take_review_level_list'] && (
        <ErrorMessage message={errors?.stocks_take_review_level_list?.root?.message} />
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

export default StocksTakeTypeReview;
