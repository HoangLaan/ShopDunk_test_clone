import BWImage from 'components/shared/BWImage/index';
import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import { approvedOffWorkReviewList } from '../helpers/call-api';
import { useFormContext } from 'react-hook-form';

const renderReview = (valueRender = {}, useCallback) => {
  //Class "bw_red" cho trang thai khong duyet

  if (valueRender?.is_review == 1 || valueRender?.is_auto_review) {
    return (
      <>
        <td className='bw_text_center bw_green'>Đã duyệt</td>
        <td>{valueRender?.is_auto_review ? 'Duyệt tự dộng' : valueRender?.note || 'Không có nội dung'}</td>
      </>
    );
  } else if (valueRender?.is_review == 2 && valueRender?.is_can_review) {
    return (
      <>
        <td className='bw_text_center'>
          <button
            className='bw_btn bw_btn_success'
            style={{ marginRight: 8 }}
            onClick={() => useCallback('is_review', 1)}>
            Duyệt
          </button>
          <button className='bw_btn bw_btn_danger' onClick={() => useCallback('is_review', 0)}>
            Không duyệt
          </button>
        </td>
        <td>
          <textarea
            placeholder='Nội dung'
            className='bw_inp'
            onChange={({ target: { value } }) => useCallback('note', value)}></textarea>
        </td>
      </>
    );
  } else if (valueRender?.is_review == 0) {
    return (
      <>
        <td className='bw_text_center bw_red'>Không duyệt</td>
        <td>{valueRender?.is_auto_review ? 'Duyệt tự dộng' : valueRender?.note || 'Không có nội dung'}</td>
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

const OffWorkReviewConfirm = ({ offworkReviewList: _offworkReviewList = [] }) => {
  const [offworkReviewList, setOffworkReviewList] = useState([]);
  const { watch } = useFormContext();

  useEffect(() => {
    setOffworkReviewList(_offworkReviewList);
  }, [_offworkReviewList]);

  const handleApprove = (idx, key, value) => {
    let _new_offworkReviewList = [...offworkReviewList];
    // Lấy giá trị tại thời điểm đó
    if (key === 'note') {
      _new_offworkReviewList[idx][key] = value;
      setOffworkReviewList(_new_offworkReviewList);
    } else if (key === 'is_review' && !_new_offworkReviewList[idx]['note']) {
      notification.error({
        message: 'Nội dung duyệt là bắt buộc.',
      });
    } else {
      approvedOffWorkReviewList(_new_offworkReviewList[idx].off_work_review_list_id, {
        ..._new_offworkReviewList[idx],
        is_review: value,
        user_name_register: watch('user_name'),
        full_name_register: watch('full_name'),
      })
        .then(() => {
          _new_offworkReviewList[idx][key] = value;
          setOffworkReviewList(_new_offworkReviewList);
          notification.success({
            message: 'Cập nhật duyệt phép thành công.',
          });
        })
        .catch((error) => {
          notification.error({
            message: 'Lỗi không thể duyệt phép.',
          });
        });
    }
  };

  return (
    <React.Fragment>
      <table className='bw_table'>
        <thead>
          <th className='bw_sticky bw_check_sticky bw_text_center' style={{ width: '5%' }}>
            STT
          </th>
          <th style={{ width: '20%' }}>Mức duyệt</th>
          <th style={{ width: '30%' }}>Người duyệt</th>
          <th className='bw_text_center' style={{ width: '20%' }}>
            Trạng thái duyệt
          </th>
          <th style={{ width: '25%' }}>Nội dung duyệt</th>
        </thead>
        <tbody>
          {offworkReviewList && offworkReviewList.length
            ? offworkReviewList.map((_userRl, idx) => (
                <tr key={_userRl?.off_work_review_list_id}>
                  <td className='bw_sticky bw_check_sticky bw_text_center'>{idx + 1}</td>
                  <td>{_userRl?.offwork_review_level_name}</td>
                  <td>
                    <div className='bw_inf_pro'>
                      <BWImage src={_userRl?.default_picture_url} />
                      {_userRl?.review_user} - {_userRl?.review_user_full_name}
                    </div>
                  </td>
                  {_userRl?.is_auto_review ? (
                    <td className='bw_text_center bw_green'>Đã duyệt</td>
                  ) : (
                    renderReview(_userRl, (key, value) => {
                      handleApprove(idx, key, value);
                    })
                  )}
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </React.Fragment>
  );
};
export default OffWorkReviewConfirm;
