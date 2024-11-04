import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import { useEffect } from 'react';
import { getPaymentMethodByPaymentList } from 'pages/Orders/helpers/utils';

const PAYMENT_FORM_LIST = [
  { key: '1', value: 'TM/CK', label: 'TM/CK' },
  { key: '2', value: 'TM', label: 'Tiền mặt' },
  { key: '3', value: 'CK', label: 'Chuyển khoản' },
];

function OrderInfor({ title, disabled }) {
  const { watch, setValue, clearErrors } = useFormContext();

  useEffect(() => {
    if (watch('payment_status') === 1) {
      const paymentMethod = getPaymentMethodByPaymentList(watch('data_payment') || []);
      if (paymentMethod) {
        const paymentMethodItem = PAYMENT_FORM_LIST.find((item) => item.value === paymentMethod);
        if (paymentMethodItem) {
          setValue('order_payment_form', watch('order_payment_form') || paymentMethodItem.value);
        }
      }
    }
  }, [watch('data_payment'), watch('payment_status')]);

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <FormItem label='Ngày tạo' className='bw_col_4' disabled>
          <FormInput type='text' field='order_invoice_date' disabled />
        </FormItem>

        <FormItem label='Mã đơn hàng' className='bw_col_4' disabled>
          <FormInput type='text' field='order_no' disabled placeholder='Mã đơn hàng' />
        </FormItem>

        <FormItem label='Mẫu số hóa đơn' className='bw_col_4' disabled>
          <FormInput type='text' field='order_invoice_form_no' placeholder='Nhập mẫu số hóa đơn' />
        </FormItem>

        <FormItem label='Ngày hóa đơn' className='bw_col_4' disabled>
          <FormInput type='text' field='order_invoice_date' disabled />
        </FormItem>

        <FormItem label='Ký hiệu hóa đơn' className='bw_col_4' disabled>
          <FormInput type='text' field='order_invoice_serial' placeholder='Nhập ký hiệu hóa đơn' />
        </FormItem>

        <FormItem label='Số hóa đơn' className='bw_col_4' disabled={disabled}>
          <FormInput type='text' field='order_invoice_no' placeholder='Nhập số hóa đơn' />
        </FormItem>

        {/* <FormItem label='Hình thức thanh toán' className='bw_col_12' disabled isRequired>
          <FormRadioGroup custom field='order_payment_form' list={PAYMENT_FORM_LIST} />
        </FormItem> */}
      </div>
    </BWAccordion>
  );
}

export default OrderInfor;
