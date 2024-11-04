import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useAuth } from '../../../context/AuthProvider';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { approvedReview } from 'services/stocks-in-request.service';
import { ToastStyle, REVIEW_TYPE } from './utils/constants';

export default function ModalReview({ disabled, itemReviewLevel, setShowModalReview, onRefresh }) {
  const methods = useForm();
  const { watch, setValue } = methods;
  const [isReviewed, setIsReviewed] = useState(0);
  useEffect(() => {
    if (itemReviewLevel) {
      setValue('review_level', itemReviewLevel);
    }
  }, [itemReviewLevel]);
  const handleApprove = async (value) => {
    try {
      if (!watch('review_level.review_note')) {
        showToast.warning('Ghi chú duyệt là bắt buộc!', ToastStyle);
        return;
      }

      //setValue('review_level.is_reviewed', value);
      // let _data = watch('review_level')
      // console.log(_data)

      // item.is_reviewed = is_reviewed;
      // item.review_note = item.review_note;
      // review_level[idx].review_date = moment().format('DD/MM/YY HH:mm:ss');
      // review_level[idx].review_date = moment(new Date(), 'DD/MM/yyyy HH:mm:ss').format('DD/MM/yyyy HH:mm:ss');
      await approvedReview({ ...watch('review_level'), is_reviewed: value });
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
            <h3>Duyệt phiếu nhập kho</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={() => setShowModalReview(false)} />
          </div>
          <div className='bw_main_modal'>
            <div className='bw_frm_box bw_readonly'>
              <label>Ghi chú duyệt</label>
              <FormTextArea
                //className='bw_inp bw_mt_1 bw_mb_1'
                field={`review_level.review_note`}
                //disabled={disabled}
                placeholder='Nhập ghi chú'
                validation={{
                  required: 'Ghi chú duyệt là bắt buộc',
                }}
              />
            </div>
          </div>
          <div className='bw_footer_modal bw_flex bw_justify_content_right bw_align_items_center'>
            <button type='button' className='bw_btn bw_btn_success' onClick={() => handleApprove(REVIEW_TYPE.ACCEPT)}>
              <span className='fi fi-rr-check' /> Duyệt phiếu
            </button>
            <button type='button' className='bw_btn bw_btn_danger' onClick={() => handleApprove(REVIEW_TYPE.REJECT)}>
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
