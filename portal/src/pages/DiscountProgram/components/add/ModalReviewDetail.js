import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { showToast } from 'utils/helpers';
import { ToastStyle } from 'pages/Promotions/utils/constants';
import { ReviewStatus } from 'pages/DiscountProgram/ultils/constant';
import { approveReview } from 'services/discount-program.service';

import FormTextArea from 'components/shared/BWFormControl/FormTextArea';

export default function ModalReviewDetail({ discount_program_id, loadDetail, onClose }) {
  const methods = useForm();
  const { watch } = methods;

  const handleApprove = async (value) => {
    try {
      if (!watch('note_review')) {
        showToast.warning('Ghi chú duyệt là bắt buộc!', ToastStyle);
        return;
      }

      await approveReview(discount_program_id, { is_review: value, note_review: watch('note_review') });
      showToast.success('Cập nhật trạng thái duyệt thành công!', ToastStyle);
    } catch (error) {
      showToast.error('Đã có lỗi xảy ra. Vui lòng F5 thử lại!', ToastStyle);
    }
    onClose();
    loadDetail();
  };

  return (
    <FormProvider {...methods}>
      <div className='bw_modal bw_modal_open' id='bw_confirm_modal'>
        <div className='bw_modal_container'>
          <div className='bw_title_modal'>
            <h3>Duyệt chương trình chiết khấu</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose} />
          </div>
          <div className='bw_main_modal'>
            <div className='bw_frm_box bw_readonly'>
              <label>Ghi chú duyệt</label>
              <FormTextArea
                field={`note_review`}
                placeholder='Nhập ghi chú'
                validation={{
                  required: 'Ghi chú duyệt là bắt buộc',
                }}
              />
            </div>
          </div>
          <div className='bw_footer_modal bw_flex bw_justify_content_right bw_align_items_center'>
            <button type='button' className='bw_btn bw_btn_success' onClick={() => handleApprove(ReviewStatus.ACCEPT)}>
              <span className='fi fi-rr-check' /> Duyệt phiếu
            </button>
            <button type='button' className='bw_btn bw_btn_danger' onClick={() => handleApprove(ReviewStatus.REJECT)}>
              <span className='fi fi-rr-check' /> Không duyệt
            </button>
            <button type='button' className='bw_btn_outline bw_close_modal' onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
