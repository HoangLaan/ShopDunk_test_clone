/* eslint-disable react/style-prop-object */
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { toast } from 'react-toastify';
import { ToastStyle } from 'pages/Promotions/utils/constants';
import { reviewCommissions } from 'services/commission.service';

function ModalReview({ onClose, commisssionId }) {
  const { register, setValue, getValues, trigger } = useFormContext();

  const onConfirm = async (is_reviewed) => {
    try {
      const result = await trigger("modal_reviewed_note");
      if (!result) return false;

      setValue('is_reviewed', is_reviewed);
      setValue('reviewed_note', getValues('modal_reviewed_note'));
      await reviewCommissions({ is_review: is_reviewed , commission_id: commisssionId});
      toast.success('Cập nhật trạng thái duyệt thành công!', ToastStyle);
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng F5 thử lại!', ToastStyle);
    }
    onClose();
  }

  return (
    <div className='bw_modal bw_modal_open' id='bw_modal_review'>
      <div className='bw_modal_container bw_w500'>
        <div className='bw_title_modal'>
          <h3>Duyệt</h3>
          <h3></h3>
          <span onClick={onClose} className='fi fi-rr-cross-small bw_close_modal'></span>
        </div>
        <div className='bw_main_modal'>
          <FormItem label='Ghi chú duyệt' isRequired={true} style='gray'>
            <FormTextArea
              rows={3}
              field='modal_reviewed_note'
              placeholder='Nhập ghi chú duyệt'
              validation={{
                required: 'Vui lòng nhập ghi chú duyệt',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_footer_modal'>
          <input type='hidden' {...register('is_reviewed')} defaultValue={0} />
          <button
            onClick={() => onConfirm(1)}
            className='bw_btn bw_btn_success'
            type='button'>
            Duyệt
          </button>

          <button
            onClick={() => onConfirm(2)}
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
}

export default ModalReview;
