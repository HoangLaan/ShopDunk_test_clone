import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormItem from 'components/shared/BWFormControl/FormItem';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import { useFormContext } from 'react-hook-form';

const ConfirmReviewModal = ({ onClose }) => {
  const methods = useFormContext();
  const reviewIndex = methods.watch('modal_review_index');

  return (
    <ModalPortal
      title='Duyệt chia hàng'
      width={800}
      rejectText='Không duyệt'
      confirmText='Duyệt'
      onClose={onClose}
      onConfirm={async () => {
        const result = await methods.trigger('modal_note');
        if (!result) return false;

        methods.setValue(`review_list.${reviewIndex}.is_reviewed`, 1);
        methods.setValue(`review_list.${reviewIndex}.note`, methods.getValues('modal_note'));
        methods.unregister('modal_note');
        onClose();
      }}
      onReject={async () => {
        const result = await methods.trigger('modal_note');
        if (!result) return false;

        methods.setValue(`review_list.${reviewIndex}.is_reviewed`, 0);
        methods.setValue(`review_list.${reviewIndex}.note`, methods.getValues('modal_note'));
        methods.unregister('modal_note');
        onClose();
      }}>
      <FormItem label='Ghi chú duyệt' isRequired={true} style='gray'>
        <FormTextArea
          field='modal_note'
          placeholder='Nhập ghi chú duyệt'
          validation={{ required: 'Vui lòng nhập ghi chú duyệt' }}
        />
      </FormItem>
    </ModalPortal>
  );
};

export default ConfirmReviewModal;
