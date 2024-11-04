import React, { useState } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';

const AccountInformation = ({ disabled }) => {
  const [passwordType, setPasswordType] = useState('password');
  return (
    <BWAccordion title='Thông tin tài khoản'>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem disabled={disabled} label='Tài khoản'>
            <FormInput type='text' field='account' placeholder='Nhập tên tài khoản' />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem disabled={disabled} label='Mật khẩu' className='bw_relative'>
            <FormInput type={passwordType} field='password' />
            <span
              className='bw_btn bw_change_password'
              style={{ top: 33, right: 15, height: 33 }}
              onClick={() => {
                if (passwordType === 'password') setPasswordType('text');
                else setPasswordType('password');
              }}>
              <i className={passwordType === 'password' ? 'fi fi-rr-eye' : 'fi fi-rr-eye-crossed'}></i>
            </span>
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default AccountInformation;
