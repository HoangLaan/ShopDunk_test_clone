/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { showToast } from 'utils/helpers';
import { getListUserReviewById } from '../helpers/call-api';
import { useFormContext } from 'react-hook-form';
import { getErrorMessage } from '../../../utils/index';

const Review = ({ index, disabled, item, update, remove, resetIsCompleted, stocksInReviewOpts, keyUser }) => {
  const methods = useFormContext();
  const { watch, setValue } = methods;

  const handleOnChangeGetListUserReview = async (value) => {
    try {
      item.users = [];
      item.stocks_review_level_id = value;
      if (!watch(`review_users.${value}`)) {
        let reviewUser = await getListUserReviewById({ stocks_review_level_id: value });
        reviewUser = reviewUser.map(({ id, name, department_id }) => ({
          value: id,
          label: name,
          department_id: department_id,
        }));
        setValue(`review_users.${value}`, reviewUser);
      }
      update(index, item);
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const getOptionsReview = () => {
    let reviews = watch('stocks_in_review_level_list') || [];
    return (stocksInReviewOpts || []).map((k) => {
      let _disabled = (reviews || []).find((p) => p.stocks_review_level_id == k.value);
      return {
        ...k,
        disabled: !!_disabled,
      };
    });
  };

  const handleChangeAutoReview = (e) => {
    if (e.target.checked) {
      item.users = [];
    }
    item.is_auto_reviewed = e.target.checked === true ? 1 : false;
    update(index, item);
  };

  const handleChangeReviewUser = (value, opts) => {
    item.users = opts;
    update(index, item);
  };
  const handleChangeCompletedReview = (e) => {
    resetIsCompleted(index);
    item.is_completed_reviewed = e.target.checked === true ? 1 : false;
    update(index, item);
  };

  return (
    <React.Fragment>
      <tr>
        <td className='bw_sticky bw_check_sticky'>{index + 1}</td>
        <td>
          <FormSelect
            id={`stocks_review_level_id_${index}`}
            className='bw_inp'
            field={`${keyUser}.stocks_review_level_id`}
            list={getOptionsReview()}
            onChange={handleOnChangeGetListUserReview}
            disabled={disabled}
            style={{ padding: '2px 8px' }}
          />
        </td>
        <td>
          {watch(`${keyUser}.is_auto_reviewed`) === 1 ? (
            <span>Tự động duyệt</span>
          ) : (
            <FormSelect
              id={`users_${index}`}
              className='bw_inp'
              field={`${keyUser}.users`}
              list={watch(`review_users.${watch(`${keyUser}.stocks_review_level_id`)}`) || []}
              mode='multiple'
              disabled={disabled}
              style={{ padding: '2px 8px' }}
              onChange={handleChangeReviewUser}
            />
          )}
        </td>
        <td className='bw_text_center'>
          <label className='bw_checkbox'>
            <FormInput
              type='checkbox'
              field={`${keyUser}.is_auto_reviewed`}
              disabled={disabled}
              onChange={handleChangeAutoReview}
            />
            <span />
          </label>
        </td>
        <td className='bw_text_center'>
          <label className='bw_radio'>
            <FormInput
              type='radio'
              field={`${keyUser}.is_completed_reviewed`}
              disabled={disabled}
              onChange={handleChangeCompletedReview}
            />
            <span />
          </label>
        </td>
        <td className='bw_sticky bw_action_table bw_text_center'>
          <a
            className='bw_btn_table bw_delete bw_red'
            onClick={() => (disabled ? null : remove(index))}
            disabled={disabled}>
            <i className='fi fi-rr-trash'></i>
          </a>
        </td>
      </tr>
    </React.Fragment>
  );
};

export default Review;
