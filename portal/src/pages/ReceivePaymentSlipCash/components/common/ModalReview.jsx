import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { showToast } from 'utils/helpers';
import { REVIEW_STATUS } from '../../utils/constants';
import { updateReview } from 'services/receive-slip.service';
export default function ModalReview({ itemReviewLevel, setIsShowModalReview, loadData ,reviewItem, setReviewItem}) {
  const methods = useForm();
  const { watch, setValue } = methods;
  useEffect(() => {
    if (itemReviewLevel) {
      setValue('review_level', itemReviewLevel);
    }
  }, [itemReviewLevel]);
  const onSubmitReview = async (data) => {
    try {
      console.log('data',data)
      const note = watch('review_note')
      await updateReview({...data,note,...reviewItem});
      loadData();
      showToast.success('Duyệt thành công');
      setReviewItem(null);
      setIsShowModalReview(false);
    } catch (error) {
    showToast.error(error.message ?? 'Duyệt thất bại');  
    setIsShowModalReview(false);  
    setReviewItem(null);  
    }
  };

  return (
    <FormProvider {...methods}>
      <div className='bw_modal bw_modal_open' id='bw_confirm_modal'>
        <div className='bw_modal_container'>
          <div className='bw_title_modal'>
            <h3>Duyệt thông báo</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={() => setIsShowModalReview(false)} />
          </div>
          <div className='bw_main_modal'>
            <div className='bw_frm_box bw_readonly'>
              <label>Ghi chú duyệt</label>
              <FormTextArea
                field={`review_note`}
                placeholder='Nhập ghi chú'
                validation={{
                  required: 'Ghi chú duyệt là bắt buộc',
                }}
              />
            </div>
          </div>
          <div className='bw_footer_modal bw_flex bw_justify_content_right bw_align_items_center'>
            <button type='button' className='bw_btn bw_btn_success' onClick={() => onSubmitReview({type_review:REVIEW_STATUS.APPROVE})}>
              <span className='fi fi-rr-check' /> Duyệt
            </button>
            <button type='button' className='bw_btn bw_btn_danger' onClick={() => onSubmitReview({type_review:REVIEW_STATUS.REJECT})}>
              <span className='fi fi-rr-check' /> Không duyệt
            </button>
            <button type='button' className='bw_btn_outline bw_close_modal' onClick={() => {setIsShowModalReview(false); setReviewItem(null)}}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
