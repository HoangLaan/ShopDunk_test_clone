import React, { useEffect } from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import { getErrorMessage } from 'utils/index';
import { getListUserReviewLv } from '../../../../services/budget-review-lv.service';
import { mapDataOptions4SelectCustom, showToast } from '../../../../utils/helpers';

function ItemReview({ index, disabled, optionsReviewLevel = [], item, update, remove, resetIsCompleted }) {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  useEffect(() => {
    if (!watch(`review_users.${item.budget_review_level_id}`)) {
      getListUserReviewLv({ review_lv_id: item.budget_review_level_id }).then((res) => {
        setValue(`review_users.${item.budget_review_level_id}`, res);
      });
    }
  });
  const handleChangeReviewLevel = async (value, opt) => {
    try {
      item.user = null;
      item.budget_review_level_id = value;
      if (!watch(`review_users.${value}`)) {
        const reviewUser = await getListUserReviewLv({ review_lv_id: value });
        setValue(`review_users.${value}`, reviewUser);
      }
      update(index, item);
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const getOptionsReview = () => {
    const budgetReviewLevelNames = optionsReviewLevel.reduce((uniqueItems, item) => {
      const foundItem = uniqueItems.findIndex((i) => i.label === item.budget_review_level_name);
      if (foundItem == -1) {
        uniqueItems.push({
          id: item.budget_review_level_id,
          label: item.budget_review_level_name,
          name: item.budget_review_level_name,
          values: item.budget_review_level_id,
        });
      }
      return uniqueItems;
    }, []);
    return mapDataOptions4SelectCustom(budgetReviewLevelNames);
  };

  const handleChangeAutoReview = (e) => {
    if (e.target.checked) {
      item.user = null;
    }
    item.is_auto_review = e.target.checked;
    update(index, item);
  };

  const handleChangeReviewUser = (value, opts) => {
    item.user = opts;
    update(index, item);
  };

  const handleChangeCompletedReview = (e) => {
    resetIsCompleted(index);
    item.is_complete_review = e.target.checked;
    update(index, item);
  };

  return (
    <>
      <tr>
        <td className='bw_text_center'>{index + 1}</td>
        <td>
          <FormSelect
            id={`budget_type_review_list${index}`}
            className='bw_inp'
            field={`budget_type_review_list.${index}.budget_review_level_id`}
            list={getOptionsReview()}
            onChange={handleChangeReviewLevel}
            disabled={disabled}
            style={{ padding: '2px 8px' }}
          />
        </td>
        <td className='bw_text_center'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <label className='bw_checkbox' style={{ marginRight: 0 }}>
              <FormInput
                type='checkbox'
                field={`budget_type_review_list.${index}.is_auto_review`}
                disabled={disabled}
                onChange={handleChangeAutoReview}
              />
              <span />
            </label>
          </div>
        </td>
        <td>
          {watch(`budget_type_review_list.${index}.is_auto_review`) ? (
            'Tự động duyệt'
          ) : (
            <FormSelect
              id={`budget_type_review_list${index}`}
              className='bw_inp'
              field={`budget_type_review_list.${index}.user`}
              list={watch(`review_users.${watch(`budget_type_review_list.${index}.budget_review_level_id`)}`) || []}
              style={{ padding: '2px 8px' }}
              disabled={disabled}
              maxTagCount={1}
              onChange={handleChangeReviewUser}
            />
          )}
        </td>
        <td>
          {optionsReviewLevel.map((p) => {
            if (p.budget_review_level_id == watch(`budget_type_review_list.${index}.budget_review_level_id`))
              return <h1>{p.department_name}</h1>;
          })}
        </td>
        <td className='bw_text_center '>
          <div className='bw_flex bw_justify_content_center'>
            <FormInput
              field={`budget_type_review_list.${index}.budget_level_from`}
              type={'number'}
              step={1000}
              className='bw_inp bw_w05 bw_mw_05'
              disabled={disabled}
            />
            <div className='bw_text_center bw_col_12 '> -</div>
            <FormInput
              field={`budget_type_review_list.${index}.budget_level_to`}
              type={'number'}
              step={1000}
              className='bw_w05 bw_mw_05 bw_inp'
              disabled={disabled}
            />
          </div>
        </td>
        <td className='bw_text_center'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <label className='bw_radio' style={{ marginRight: 0 }}>
              <FormInput
                type='radio'
                field={`budget_type_review_list.${index}.is_complete_review`}
                disabled={disabled}
                name='is_complete_review'
                onChange={handleChangeCompletedReview}
              />
              <span />
            </label>
          </div>
        </td>
        <td className='bw_text_center'>
          <a
            className='bw_btn_table bw_delete bw_red'
            title='Xoá'
            onClick={() => (disabled ? null : remove(index))}
            disabled={disabled}>
            <i className='fi fi-rr-trash'></i>
          </a>
        </td>
      </tr>
    </>
  );
}

export default ItemReview;
