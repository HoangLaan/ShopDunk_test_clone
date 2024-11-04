import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useFormContext } from 'react-hook-form';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';

function CouponForm({ title, disabled }) {
  const methods = useFormContext();

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <FormItem className='bw_col_4' label='Mã giảm giá' disabled={true}>
          <input value={methods.watch('coupon_code')} disabled={true} />
        </FormItem>
        <FormItem className='bw_col_4' label='Ngày sử dụng' disabled={true}>
          <input value={methods.watch('used_date') ?? 'Chưa sử dụng'} disabled={true} />
        </FormItem>
        <FormItem className='bw_col_4' label='Đơn hàng áp dụng' disabled={true}>
          <input value={methods.watch('order_no') ?? 'Chưa mua hàng'} disabled={true} />
        </FormItem>
        <FormItem className='bw_col_4' label='Thời gian áp dụng' disabled={disabled}>
          <FormRangePicker
            style={{ width: '100%' }}
            fieldStart='start_date'
            fieldEnd='end_date'
            placeholder={['Từ ngày', 'Đến ngày']}
            format='DD/MM/YYYY'
            allowClear={true}
            disabled={disabled}
          />
        </FormItem>
      </div>
    </BWAccordion>
  );
}

export default CouponForm;
