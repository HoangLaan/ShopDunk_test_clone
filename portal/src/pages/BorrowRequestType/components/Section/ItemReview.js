import React, { useEffect } from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import { getErrorMessage } from 'utils/index';
import { getOptionsReviewUser } from 'services/borrow-request-rl.service';
import { mapDataOptions4SelectCustom, showToast } from 'utils/helpers';

function ItemReview({ index, disabled, optionsReviewLevel = [], item, update, remove, resetIsCompleted }) {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const handleChangeReviewLevel = async (value, opt) => {
    try {
      item.user = null;
      item.borrow_review_level_id = value;
      if (!watch(`review_users.${value}`)) {
        const reviewUser = await getOptionsReviewUser({ review_lv_id: value });
        setValue(`review_users.${value}`, reviewUser);
      }
      update(index, item);
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const getOptionsReview = () => {
    const borrowReviewLevelNames = optionsReviewLevel.reduce((uniqueItems, item) => {
      const foundItem = uniqueItems.findIndex((i) => i.label === item.borrow_review_level_name);
      if (foundItem == -1) {
        uniqueItems.push({
          id: item.borrow_review_level_id,
          label: item.borrow_review_level_name,
          name: item.borrow_review_level_name,
          values: item.borrow_review_level_id,
        });
      }
      return uniqueItems;
    }, []);
    return mapDataOptions4SelectCustom(borrowReviewLevelNames);
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
            id={`borrow_type_review_list${index}`}
            className='bw_inp'
            field={`borrow_type_review_list.${index}.borrow_review_level_id`}
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
                field={`borrow_type_review_list.${index}.is_auto_review`}
                disabled={disabled}
                onChange={handleChangeAutoReview}
              />
              <span />
            </label>
          </div>
        </td>
        <td>
          {watch(`borrow_type_review_list.${index}.is_auto_review`) ? (
            'Tự động duyệt'
          ) : (
            <FormSelect
              id={`borrow_type_review_list${index}`}
              className='bw_inp'
              field={`borrow_type_review_list.${index}.user`}
              list={watch(`review_users.${watch(`borrow_type_review_list.${index}.borrow_review_level_id`)}`) || []}
              style={{ padding: '2px 8px' }}
              disabled={disabled}
              maxTagCount={1}
              onChange={handleChangeReviewUser}
            />
          )}
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
