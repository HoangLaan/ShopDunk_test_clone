import React from 'react';
import { useFormContext } from 'react-hook-form';
import { showToast } from 'utils/helpers';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getErrorMessage } from 'utils/index';
import { getList } from 'services/users.service';
import { mapDataOptions4SelectCustom } from 'utils/helpers';

function ItemReview({
  index,
  disabled,
  optionsReviewLevel = [],
  item,
  update,
  remove,
  resetIsCompleted,
  departmentOpts = [],
}) {
  const methods = useFormContext();
  const { watch, setValue } = methods;

  const handleChangeReviewLevel = async (value, opt) => {
    try {
      item.price_review_level_id = value;

      update(index, item);
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const getOptionsReview = () => {
    let reviews = watch('reviews') || [];
    return (optionsReviewLevel || []).map((k) => {
      let _disabled = (reviews || []).find((p) => parseInt(p.price_review_level_id) === parseInt(k.value));
      return {
        ...k,
        disabled: !!_disabled,
      };
    });
  };

  const getOptionsDepartment = () => {
    let reviews = watch('reviews') || [];
    return (departmentOpts || []).map((k) => {
      let _disabled = (reviews || []).find((p) => parseInt(p.department_id) === parseInt(k.value));
      return {
        ...k,
        disabled: !!_disabled,
      };
    });
  };

  const handleChangeReviewDepartment = async (value, opts) => {
    item.users = [];
    item.department_id = value;
    if (!watch(`review_users.${value}`)) {
      let { items = [] } = await getList({ department_id: value, itemsPerPage: 100 });

      setValue(`review_users.${value}`, mapDataOptions4SelectCustom(items, 'user_name', 'full_name'));
    }

    update(index, item);
  };

  const hanldeChangeAutoReview = (e) => {
    if (e.target.checked) {
      item.users = [];
    }
    item.is_auto_reviewed = e.target.checked;
    update(index, item);
  };

  const handleChangeReviewUser = (value, opts) => {
    item.users = opts;
    update(index, item);
  };

  const handleChangeCompletedReview = (e) => {
    resetIsCompleted(index);
    item.is_completed_reviewed = e.target.checked;
    update(index, item);
  };

  return (
    <>
      <tr>
        <td className='bw_text_center'>{index + 1}</td>
        <td>
          <FormSelect
            id={`price_review_level_${index}`}
            className='bw_inp'
            field={`reviews.${index}.price_review_level_id`}
            list={getOptionsReview()}
            onChange={handleChangeReviewLevel}
            disabled={disabled}
            style={{ padding: '2px 8px' }}
          />
        </td>
        <td>
          <FormSelect
            id={`department_review_level_${index}`}
            className='bw_inp'
            field={`reviews.${index}.department_id`}
            list={getOptionsDepartment()}
            onChange={handleChangeReviewDepartment}
            disabled={disabled}
            style={{ padding: '2px 8px' }}
          />
        </td>
        <td>
          {watch(`reviews.${index}.is_auto_reviewed`) ? (
            'Tự động duyệt'
          ) : (
            <FormSelect
              id={`price_review_user_${index}`}
              className='bw_inp'
              field={`reviews.${index}.users`}
              list={watch(`review_users.${watch(`reviews.${index}.department_id`)}`) || []}
              mode='multiple'
              style={{ padding: '2px 8px' }}
              disabled={disabled}
              maxTagCount={1}
              onChange={handleChangeReviewUser}
            />
          )}
        </td>
        <td className='bw_text_center'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <label className='bw_checkbox' style={{ marginRight: 0 }}>
              <FormInput
                type='checkbox'
                field={`reviews.${index}.is_auto_reviewed`}
                disabled={disabled}
                onChange={hanldeChangeAutoReview}
              />
              <span />
            </label>
          </div>
        </td>
        <td className='bw_text_center'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <label className='bw_radio' style={{ marginRight: 0 }}>
              <FormInput
                type='radio'
                field={`reviews.${index}.is_completed_reviewed`}
                disabled={disabled}
                name='is_completed_reviewed'
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
