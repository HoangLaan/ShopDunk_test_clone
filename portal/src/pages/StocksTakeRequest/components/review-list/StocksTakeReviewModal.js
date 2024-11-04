import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { showToast } from 'utils/helpers';
import { REVIEW_TYPE } from 'pages/StocksOutRequest/utils/constants';
import { reviewStocksTakeRequest } from 'services/stocks-take-request.service';

const StocksTakeReviewModal = ({ onClose }) => {
  const [note, setNote] = useState(undefined);
  const { reviewData } = useSelector((state) => state.stocksTakeRequest);

  const onSubmit = async (type) => {
    try {
      await reviewStocksTakeRequest({
        note,
        type: type,
        ...reviewData,
      });
      showToast.success('Thành công!!!');
      window.location.reload();
      return;
    } catch (error) {
      showToast.error('Có lỗi xảy ra!');
    }
  };
  return (
    <div className='bw_modal bw_modal_open' id='bw_skill'>
      <div className='bw_modal_container bw_w500'>
        <div className='bw_title_modal'>
          <h3>Duyệt phiếu kiểm kê</h3>
          <span onClick={onClose} className='fi fi-rr-cross-small bw_close_modal'></span>
        </div>
        <div className='bw_main_modal'>
          <div className='bw_frm_box bw_readonly'>
            <label>Lý do</label>
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

export default StocksTakeReviewModal;
