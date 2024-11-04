import React from 'react';
import { useForm } from 'react-hook-form';

import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import FormZaloDynamic from '../Forms/FormZaloDynamic';

function ModalZalo({ onClose, onConfirm }) {
  const methods = useForm();

  return (
    <ModalPortal
      title='Thông tin gửi tin nhắn ZaloOA'
      confirmText='Xác nhận'
      onClose={onClose}
      onConfirm={() => methods.handleSubmit(onConfirm)()}>
      <FormZaloDynamic methods={methods} />
    </ModalPortal>
  );
}

export default ModalZalo;
