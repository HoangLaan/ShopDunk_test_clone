import React from 'react';
import { useFormContext } from 'react-hook-form';

function ModalStop({ onClose, onSubmit, isShow }) {
  const { register, setValue, getValues } = useFormContext();

  return isShow ? (
    <div className='bw_modal bw_modal_open' id='bw_modal_review'>
      <div className='bw_modal_container bw_w500'>
        <div className='bw_title_modal'>
          <h3>Xác nhận dừng chương trình hoa hồng</h3>
          <span onClick={onClose} className='fi fi-rr-cross-small bw_close_modal'></span>
        </div>
        <div className='bw_main_modal'>
          <div className='bw_frm_box bw_readonly'>
            <label>Lý do dừng chương trình</label>
            <textarea placeholder='Nhập mô tả' {...register('modal_stopped_reason')}></textarea>
          </div>
        </div>
        <div className='bw_footer_modal'>
          <input type='hidden' {...register('is_reviewed')} defaultValue={0} />
          <button
            onClick={() => {
              setValue('is_stopped', 1);
              setValue('stopped_reason', getValues('modal_stopped_reason'));
              onSubmit();
            }}
            className='bw_btn bw_btn_danger'
            type='button'>
            Xác nhận dừng
          </button>
          <button className='bw_btn_outline bw_close_modal' onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  ): null;
}

export default ModalStop;
