import Modal from 'components/shared/Modal/index';
import { Input } from 'antd';
import BWButton from 'components/shared/BWButton/index';
import { Fragment, useState } from 'react';
import { updateReview } from 'services/request-using-budget.service';
import { showToast } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';
const { TextArea } = Input;
const ConfirmReviewModal = ({ open, onClose, item }) => {
  const { watch } = useFormContext();
  const [reviewNote, setReviewNote] = useState('');
  const onReview = async (status) => {
    try {
      await updateReview({
        budget_review_list_id: item.budget_review_list_id,
        request_using_budget_id: item.request_using_budget_id,
        is_review: status,
        review_note: reviewNote,
        list_budget_goal: watch('list_budget_goal'),
      });
      showToast.success(`Cập nhật thành công`);
      onClose?.();
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    }
    onClose?.();
  };
  return (
    <Modal
      header='Duyệt phiếu đề nghị sử dụng ngân sách'
      witdh={'30%'}
      open={open}
      onClose={onClose}
      footer={
        <Fragment>
          <BWButton type={'success'} onClick={() => onReview(1)} content={'Duyệt'} />
          <BWButton type={'danger'} onClick={() => onReview(0)} content={'Không duyệt'} />
        </Fragment>
      }>
      <label>Ghi chú duyệt</label>
      <TextArea rows={4} value={reviewNote} onChange={(e) => setReviewNote(e.target.value)}></TextArea>
    </Modal>
  );
};
export default ConfirmReviewModal;
