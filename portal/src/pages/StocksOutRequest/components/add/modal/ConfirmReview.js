import React, { useMemo, useState } from 'react';
import { useAuth } from 'context/AuthProvider';
import { reviewStocksOutRequest } from 'services/stocks-out-request.service';
import { showToast } from 'utils/helpers';
import { REVIEW_TYPE } from 'pages/StocksOutRequest/utils/constants';

const ConfirmReview = ({ dataReview, onClose }) => {
  const { user } = useAuth();
  const findReview = useMemo(() => dataReview?.review_list.find((p) => p?.user_name === user.user_name));

  const [note, setNote] = useState(undefined);

  const onSubmit = async (type) => {
    try {
      await reviewStocksOutRequest({
        note,
        type: type,
        ...findReview,
      });
      showToast.success('Thành công!!!');
      onClose();
    } catch (error) {
      showToast.error('Có lỗi xảy ra!');
    }
  };
  return (
    <div className='bw_modal bw_modal_open' id='bw_skill'>
      <div className='bw_modal_container bw_w500'>
        <div className='bw_title_modal'>
          <h3>Duyệt phiếu phiếu xuất kho</h3>
          <span onClick={onClose} className='fi fi-rr-cross-small bw_close_modal'></span>
        </div>
        <div className='bw_main_modal'>
          <div className='bw_frm_box bw_readonly'>
            <label>Ghi chú duyệt</label>
            <textarea
              onChange={(e) => {
                setNote(e.target.value);
              }}
              className=''
              placeholder='Nhập mô tả'></textarea>
          </div>
        </div>
        <div className='bw_footer_modal'>
          <button
            onClick={() => {
              onSubmit(REVIEW_TYPE.ACCEPT);
            }}
            className='bw_btn bw_btn_success'
            type='button'>
            Duyệt phiếu
          </button>

          <button
            onClick={() => {
              onSubmit(REVIEW_TYPE.REJECT);
            }}
            className='bw_btn bw_btn_danger'
            type='button'>
            Không duyệt
          </button>
          <button className='bw_btn_outline bw_close_modal' onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmReview;
