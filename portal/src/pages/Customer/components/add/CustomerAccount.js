import React, { useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { useParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import CustomerResetPassword from './CustomerResetPassword';

const CustomerAccount = ({ disabled }) => {
  const methods = useFormContext();
  const { account_id } = useParams();
  const [modalReset, setModalReset] = useState(false);

  return (
    <BWAccordion title='Thông tin tài khoản'>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem isRequired disabled={disabled} label='Email'>
            <FormInput
              type='text'
              field='email'
              placeholder='Nhập email'
              validation={{
                required: 'Email là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem isRequired display='flex' disabled={disabled} label='Mật khẩu'>
            <FormInput
              type='password'
              field='password'
              value={account_id ? '**************' : methods.watch('password')}
              placeholder='Nhập mật khẩu'
              validation={{
                required: !account_id && 'Mật khẩu bắt buộc',
              }}
            />
            {account_id && (
              <span
                onClick={() => {
                  setModalReset(true);
                }}
                className='bw_btn bw_btn_success'>
                <i className='fi fi-rr-refresh'></i>
              </span>
            )}
          </FormItem>
        </div>
      </div>
      {modalReset && (
        <CustomerResetPassword
          onClose={() => {
            setModalReset(false);
          }}
        />
      )}
    </BWAccordion>
  );
};

export default CustomerAccount;
