import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { notification } from 'antd';
import { approvedReviewList } from 'pages/StocksTransfer/helpers/call-api';
import { showToast } from 'utils/helpers';

const ReviewModal = ({ open, onClose, stocksTransfer }) => {
  const [reviewNote, setReviewNote] = useState('');

  const handleApprove = (value) => {
    if (!reviewNote) {
      showToast.error('Nội dung duyệt là bắt buộc.');
    } else {
      let params = {
        is_reviewed: value,
        stocks_transfer_id: stocksTransfer?.stocks_transfer_id,
        review_note: reviewNote,
      };

      approvedReviewList(params)
        .then(() => {
          showToast.success('Cập nhật duyệt phiếu chuyển kho thành công.');
          onClose();
        })
        .catch((error) => {
          showToast.error('Lỗi không thể duyệt phiếu chuyển kho.');
        });
    }
  };

  return (
    <React.Fragment>
      <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_notice_del'>
        <div className='bw_modal_container '>
          <div className='bw_title_modal'>
            <h3>Duyệt phiếu chuyển kho</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose}></span>
          </div>
          <div className='bw_main_modal'>
            <div className='bw_frm_box bw_readonly'>
              <label>Ghi chú duyệt</label>
              <textarea
                onChange={({ target: { value } }) => setReviewNote(value)}
                className=''
                placeholder='Nhập dung ghi chú'></textarea>
            </div>
          </div>
          <div className='bw_footer_modal'>
            <button className='bw_btn bw_btn_success' type='button' onClick={() => handleApprove(1)}>
              <span className='fi fi-rr-check'></span> Duyệt phiếu
            </button>
            <button className='bw_btn bw_btn_danger' type='button' onClick={() => handleApprove(0)}>
              <span className='fi fi-rr-cross'></span>
              Không duyệt
            </button>
            <button type='button' onClick={onClose} className='bw_btn_outline bw_btn_outline_danger'>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

ReviewModal.propTypes = {
  open: PropTypes.bool,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
};

export default ReviewModal;
