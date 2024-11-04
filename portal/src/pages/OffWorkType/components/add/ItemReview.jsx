import React from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { getErrorMessage } from 'utils/index';
import { getUserReview } from 'pages/OffWorkType/helpers/call-api';

function ItemReview({ index, disabled, optionsReviewLevel = [], item, update, remove, resetIsCompleted}) {
  const methods = useFormContext();
  const { watch, setValue } = methods;

  const handleChangeReviewLevel = async (value, opt) => {
    try {
      item.users = [];
      item.offwork_review_level_id = value;
      if (!watch(`review_users.${value}`)) {
        const reviewUser = await getUserReview(value, { company_id: watch('company_id') });

        setValue(`review_users.${value}`, reviewUser);
      }
      update(index, item);
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const getOptionsReview = () => {
    let reviews = watch('offwork_type_review_list') || [];
    return (optionsReviewLevel || []).map((k) => {
      let _disabled = (reviews || []).find((p) => p.offwork_review_level_id == k.value);
      return {
        ...k,
        disabled: !!_disabled,
      };
    });
  };

  const hanldeChangeAutoReview = (e) => {
    if (e.target.checked) {
      item.users = [];
    }
    item.is_auto_review = e.target.checked;
    update(index, item);
  };

  const handleChangeReviewUser = (value, opts) => {
    if(value.includes('ALL')){
      item.users = watch(`review_users.${watch(`offwork_type_review_list.${index}.offwork_review_level_id`)}`);
    } else {
      item.users = opts;
    }
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
            id={`offwork_type_review_list${index}`}
            className='bw_inp'
            field={`offwork_type_review_list.${index}.offwork_review_level_id`}
            list={getOptionsReview()}
            onChange={handleChangeReviewLevel}
            disabled={disabled}
            style={{ padding: '2px 8px' }}
          />
        </td>
        <td>
          {watch(`offwork_type_review_list.${index}.is_auto_review`) ? (
            'Tự động duyệt'
          ) : (
            <FormSelect
              id={`offwork_type_review_list${index}`}
              className='bw_inp'
              field={`offwork_type_review_list.${index}.users`}
              list={[{label: 'Chọn tất cả', value: 'ALL'},...watch(`review_users.${watch(`offwork_type_review_list.${index}.offwork_review_level_id`)}`) || []] || []}
              mode='multiple'
              style={{ padding: '2px 8px' }}
              disabled={disabled}
              onChange={handleChangeReviewUser}
              maxTagCount={5}
            />
          )}
        </td>
        <td className='bw_text_center'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <label className='bw_checkbox' style={{ marginRight: 0 }}>
              <FormInput
                type='checkbox'
                field={`offwork_type_review_list.${index}.is_auto_review`}
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
                field={`offwork_type_review_list.${index}.is_complete_review`}
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
