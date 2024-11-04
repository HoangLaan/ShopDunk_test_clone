import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useFormContext } from 'react-hook-form';

function CustomerForm({ title }) {
  const methods = useFormContext();

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <FormItem className='bw_col_4' label='Mã khách hàng' disabled={true}>
          <input value={methods.watch('customer_code')} disabled={true} />
        </FormItem>
        <FormItem className='bw_col_4' label='Tên khách hàng' disabled={true}>
          <input value={methods.watch('full_name')} disabled={true} />
        </FormItem>
        <FormItem className='bw_col_4' label='Ngày sinh' disabled={true}>
          <input value={methods.watch('birthday')} disabled={true} />
        </FormItem>
        <FormItem className='bw_col_4' label='Giới tính' disabled={true}>
          <input value={methods.watch('gender')} disabled={true} />
        </FormItem>
        <FormItem className='bw_col_4' label='Email' disabled={true}>
          <input value={methods.watch('email')} disabled={true} />
        </FormItem>
        <FormItem className='bw_col_4' label='Số điện thoại' disabled={true}>
          <input value={methods.watch('phone_number')} disabled={true} />
        </FormItem>
      </div>
    </BWAccordion>
  );
}

export default CustomerForm;
