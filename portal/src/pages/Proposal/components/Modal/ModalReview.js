import Modal from 'components/shared/Modal/index';
import { Input } from 'antd';
import BWButton from 'components/shared/BWButton/index';
import { Fragment, useState } from 'react';
import { showToast } from 'utils/helpers';
import { updateReview } from 'services/proposal.service';
import { configToast } from 'pages/Proposal/utils/constants';
const { TextArea } = Input;
const ModalReview = ({ open, onClose, id }) => {
  const [reviewNote, setReviewNote] = useState('');
  const onReview = async (status) => {
    try {
      await updateReview({
        proposal_review_list_id: id,
        is_review: status,
        review_note: reviewNote,
      });
      setReviewNote(null);
      showToast.success(`Cập nhật thành công`, configToast);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra', configToast);
    }
    onClose?.(null, true);
  };
  return (
    <Modal
      header='Duyệt đề xuất'
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
export default ModalReview;
