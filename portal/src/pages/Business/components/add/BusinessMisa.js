import BWAccordion from 'components/shared/BWAccordion';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input } from 'antd';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { useAuth } from 'context/AuthProvider';
import { checkMisaPermission } from 'pages/Business/helper';

const CustomInput = styled.div`
  .ant-input-password {
    border: none !important;
    border-color: transparent !important;
    box-shadow: none !important;
    padding: 4px 0;
  }
`;

const BusinessMisaAccount = ({ disabled, title }) => {
  const methods = useFormContext();
  const { watch } = methods;
  const { user } = useAuth();

  const have_permission = checkMisaPermission(user, watch('business_id'));

  React.useEffect(() => {
    methods.register('misa_password');
  }, [methods]);

  return (
    <BWAccordion title={title} id='bw_address_com'>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem disabled={!have_permission} label='Tên tài khoản' isRequired>
            <FormInput field='misa_username' />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem disabled={!have_permission} label='Mật khẩu' isRequired>
            <CustomInput>
              <Input.Password
                disabled={!have_permission}
                placeholder='input password'
                field='misa_password'
                autoComplete={false}
                value={methods.watch('misa_password') ?? ''}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                onChange={(e) => {
                  methods.setValue('misa_password', e.target.value);
                  methods.setValue('is_change_password', 1);
                }}
              />
            </CustomInput>
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};
export default BusinessMisaAccount;
