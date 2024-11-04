import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { getPaymentPolicy } from 'pages/Orders/helpers/call-api';

import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';

function TermsOfPayment({ disabled }) {
  const methods = useFormContext();
  const { watch, setValue } = methods;

  const terms_of_payment = watch('terms_of_payment');

  useEffect(() => {
    if (!terms_of_payment) {
      getPaymentPolicy().then((res) => {
        setValue('terms_of_payment', res);
      });
    }
  }, [terms_of_payment, setValue]);

  return (
    <React.Fragment>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem label='Điều khoản thanh toán' disabled={disabled}>
            <FormTextArea style={{ maxWidth: '100%', minWidth: '100%' }} rows={9} field='terms_of_payment' disabled />
          </FormItem>
        </div>
      </div>
      <label className='bw_checkbox'>
        <FormInput type='checkbox' field='is_agree_policy' disabled={disabled} />
        <span />
        Tôi đã đọc và đồng ý với
        <a
          href='https://shopdunk.com/chinh-sach-doi-tra'
          target='_blank'
          rel='noopener noreferrer'
          style={{ margin: '0 5px' }}>
          chính sách
        </a>
        và điều khoản thanh toán
      </label>
    </React.Fragment>
  );
}

export default TermsOfPayment;
