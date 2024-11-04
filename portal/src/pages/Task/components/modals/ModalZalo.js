import React from 'react';
import { useForm } from 'react-hook-form';
import FormZalo, { ZALO_TYPE_SEND } from 'components/shared/FormZalo/FormZalo';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import { showToast } from 'utils/helpers';
import ZaloOAService from 'services/zalo-oa.service.';

function ModalZalo({ onClose, customer }) {
  const methods = useForm();

  const onSubmit = async (payload) => {
    try {
      const zalo_type_send = methods.watch('zalo_type_send');
      const detailZNS = methods.watch('detail_zns');

      if (zalo_type_send === ZALO_TYPE_SEND.SEND_SMS && !customer.zalo_id) {
        showToast.warning('Khách hàng chưa cập nhật Zalo ID');
        return;
      }
      if (zalo_type_send === ZALO_TYPE_SEND.SEND_SMS && customer.zalo_id) {
        await ZaloOAService.sendTextMessage({
          text_message: payload.zalo_sms_content,
          user_id: customer.zalo_id,
        });
        onClose();
        return;
      }
      if (zalo_type_send === ZALO_TYPE_SEND.SEND_ZNS && !customer?.phone_number && payload?.phone_number) {
        showToast.warning('Chưa có số điện thoại để gửi ZNS');
        return;
      }
      if (zalo_type_send === ZALO_TYPE_SEND.SEND_ZNS) {
        await ZaloOAService.sendZNS({
          phone: customer?.phone_number || payload?.phone_number,
          template_id: String(detailZNS.templateId),
          template_data: payload,
        });
        onClose();
        return;
      }
    } catch (error) {
      showToast.error(error.message);
    }
  };

  return (
    <ModalPortal
      title='Gửi tin nhắn Zalo'
      confirmText='Gửi'
      onClose={onClose}
      onConfirm={methods.handleSubmit(onSubmit)}>
      <FormZalo customer={customer} methods={methods} />
    </ModalPortal>
  );
}

export default ModalZalo;
