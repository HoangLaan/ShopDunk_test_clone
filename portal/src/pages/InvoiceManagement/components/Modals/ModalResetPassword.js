/* eslint-disable react/style-prop-object */
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useParams } from 'react-router-dom';
import { useCustomerLeadContext } from 'pages/CustomerLead/utils/context';
import { showToast } from 'utils/helpers';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import CustomerLeadService from 'services/customer-lead.service';
import ModalPortal from './ModalPortal';
import { MODAL } from 'pages/CustomerLead/utils/constants';

const ModalResetPassword = () => {
  const methods = useForm();
  const { data_leads_id } = useParams();
  const [loading, setLoading] = useState(undefined);
  const { onOpenModalResetPassword } = useCustomerLeadContext();

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      if (payload?.password !== payload?.password_again) {
        showToast.error('Mật khẩu không khớp, vui lòng kiểm tra lại');
        return;
      }
      await CustomerLeadService.changePassword(data_leads_id, payload);
      onOpenModalResetPassword(false)
      showToast.success('Đổi mật khẩu thành công');
    } catch (err) {
      showToast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <ModalPortal
        wrapperId={MODAL.RESET_PASSWORD}
        title='Đổi mật khẩu'
        onClose={() => onOpenModalResetPassword(false)}
        onConfirm={methods.handleSubmit(onSubmit)}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormItem label='Mật khẩu mới' isRequired={true} style='gray'>
            <FormInput
              disabled={loading}
              type='password'
              field='new_password'
              placeholder='***********'
              validation={{
                required: 'Mật khẩu mới là bắt buộc',
                validate: (p) => {
                  if (p.length < 8) {
                    return 'Mật khẩu phải lớn hơn 8 chữ';
                  }
                },
              }}
            />
          </FormItem>
          <FormItem label='Nhập lại mật khẩu mới' isRequired={true} style='gray'>
            <FormInput
              disabled={loading}
              type='password'
              field='re_password'
              placeholder='***********'
              validation={{
                required: 'Nhập lại mật khẩu mới là bắt buộc',
                validate: (p) => {
                  if (p !== methods.watch('new_password')) {
                    return 'Mật khẩu không khớp, vui lòng kiểm tra lại';
                  }
                  if (p.length < 8) {
                    return 'Mật khẩu phải lớn hơn 8 chữ';
                  }
                },
              }}
            />
          </FormItem>
        </form>
      </ModalPortal>
    </FormProvider>
  );
};

export default ModalResetPassword;
