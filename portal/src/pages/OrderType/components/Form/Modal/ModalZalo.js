import React from 'react';
import { useForm } from 'react-hook-form';

import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import FormZaloZNS from 'components/shared/FormZalo/FormZaloZNS';


function ModalZalo({ onClose, onConfirm }) {
  const methods = useForm();

  return (
    <ModalPortal
      title='Thông tin gửi tin nhắn ZaloOA'
      confirmText='Xác nhận'
      onClose={onClose}
      onConfirm={() => onConfirm(methods.getValues('zalo_zns_template'))}>
      <FormZaloZNS methods={methods} />
    </ModalPortal>
  );
}

export default ModalZalo;
