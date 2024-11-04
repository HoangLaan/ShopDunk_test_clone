import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { TYPE_REVIEW, ToastStyle } from 'pages/Promotions/utils/constants';

import { reviewPrices } from 'pages/Prices/helpers/call-api';

export default function ModalReview({ itemReviewLevel, setShowModalReview, onRefresh }) {
  const methods = useForm();
  const { watch } = methods;

  const handleApprove = async (value) => {
    try {
      if (!watch('note_review')) {
        showToast.warning('Ghi chú duyệt là bắt buộc!', ToastStyle);
        return;
      }

      let idPrices = itemReviewLevel;
      if (!itemReviewLevel) {
        showToast.warning('Đã có lỗi xảy ra vui lòng kiểm tra lại!', ToastStyle);
        return;
      }
      await reviewPrices(idPrices, { is_review: value });
      showToast.success('Cập nhật trạng thái duyệt thành công!', ToastStyle);
    } catch (error) {
      showToast.error('Đã có lỗi xảy ra. Vui lòng F5 thử lại!', ToastStyle);
    }
    setShowModalReview(false);
    onRefresh();
  };

  return (
    <FormProvider {...methods}>
      <div className='bw_modal bw_modal_open' id='bw_confirm_modal'>
        <div className='bw_modal_container'>
          <div className='bw_title_modal'>
            <h3>Duyệt giá</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={() => setShowModalReview(false)} />
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
            <button type='button' className='bw_btn bw_btn_success' onClick={() => handleApprove(TYPE_REVIEW.ACCPECT)}>
              <span className='fi fi-rr-check' /> Duyệt phiếu
            </button>
            <button type='button' className='bw_btn bw_btn_danger' onClick={() => handleApprove(TYPE_REVIEW.REJECT)}>
              <span className='fi fi-rr-check' /> Không duyệt
            </button>
            <button type='button' className='bw_btn_outline bw_close_modal' onClick={() => setShowModalReview(false)}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
