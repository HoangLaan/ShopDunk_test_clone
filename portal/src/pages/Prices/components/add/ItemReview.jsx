import React from 'react';
import { showToast } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';

import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { reviewPrices } from 'pages/Prices/helpers/call-api';

const renderReview = (valueRender = {}, useCallback) => {
  //Class "bw_red" cho trang thai khong duyet

  if (valueRender?.is_review == 1 || valueRender?.is_auto_reviewed) {
    return (
      <>
        <td className='bw_text_center bw_green'>Đã duyệt</td>
        <td>{valueRender?.is_auto_review ? 'Duyệt tự dộng' : valueRender?.review_note || 'Không có nội dung'}</td>
      </>
    );
  } else if (valueRender?.is_review == 2 && valueRender?.is_can_review) {
    return (
      <>
        <td className='bw_text_center'>
          <button
            type='button'
            className='bw_btn bw_btn_success'
            style={{ marginRight: 8 }}
            onClick={() => useCallback('is_review', 1)}>
            Duyệt
          </button>
          <button type='button' className='bw_btn bw_btn_danger' onClick={() => useCallback('is_review', 0)}>
            Không duyệt
          </button>
        </td>
        <td>
          <textarea
            placeholder='Nội dung'
            className='bw_inp'
            onChange={({ target: { value } }) => useCallback('review_note', value)}></textarea>
        </td>
      </>
    );
  } else if (valueRender?.is_review == 0) {
    return (
      <>
        <td className='bw_text_center bw_red'>Không duyệt</td>
        <td>{valueRender?.is_auto_review ? 'Duyệt tự dộng' : valueRender?.review_note || 'Không có nội dung'}</td>
      </>
    );
  } else {
    return (
      <>
        <td className='bw_text_center'>Chưa duyệt</td>
        <td></td>
      </>
    );
  }
};

function ItemReview({ index, disabled, item, update, priceId }) {
  const methods = useFormContext();
  const { watch, setValue } = methods;

  const handleChangeReviewUser = (value) => {
    item.user_review = value;
    update(index, item);
  };

  const handleApprove = async (idx, key, value) => {
    // Lấy giá trị tại thời điểm đó
    if (key === 'review_note') {
      item[key] = value;
      update(index, item);
    } else if (key === 'is_review' && !watch(`review_list.${index}.review_note`)) {
      showToast.error('Nội dung duyệt là bắt buộc.', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } else {
      let params = {
        ...watch(`review_list.${index}`),
        is_reviewed: value,
      };

      item[key] = value;
      update(index, item);

      reviewPrices(priceId, params)
        .then(() => {
          showToast.success('Cập nhật duyệt giá thành công.', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        })
        .catch((error) => {
          showToast.error(error ? error?.message : 'Nội dung duyệt là bắt buộc.', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        });
    }
  };

  return (
    <>
      <tr>
        <td className='bw_text_center'>{index + 1}</td>
        <td>{watch(`review_list.${index}.review_level_name`)}</td>
        <td>{watch(`review_list.${index}.department_name`)}</td>
        <td>
          {watch(`review_list.${index}.is_auto_reviewed`) ? (
            'Tự động duyệt'
          ) : !disabled ? (
            <FormSelect
              id={`price_review_user_${index}`}
              className='bw_inp'
              field={`review_list.${index}.review_user`}
              list={watch(`review_list.${index}.users`) || []}
              style={{ padding: '2px 8px' }}
              disabled={disabled}
              onChange={handleChangeReviewUser}
            />
          ) : (
            <>{watch(`review_list.${index}.review_user_fullname`)}</>
          )}
        </td>
        {disabled ? (
          <>
            {renderReview(watch(`review_list.${index}`), (key, value) => {
              handleApprove(index, key, value);
            })}
          </>
        ) : null}
      </tr>
    </>
  );
}

export default ItemReview;
