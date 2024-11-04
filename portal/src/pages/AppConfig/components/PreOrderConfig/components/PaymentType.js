import React from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormItem from 'components/shared/BWFormControl/FormItem';
import dayjs from 'dayjs';
import { mapDataOptions4Select } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';

const PaymentType = () => {
  const methods = useFormContext();
  const { watch } = methods;
  return (
    <BWAccordion title='Cài đặt hình thức thanh toán PreOrder' id='bw_stock_out_price_config' isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem label='Hình thức thanh toán ViettinBank' isRequired={true} disabled={false}>
            <FormSelect
              field='PREOD_PAYMENTFORM_VTB'
              list={mapDataOptions4Select(watch('payment_form_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Hình thức thanh toán Zalopay' isRequired={true} disabled={false}>
            <FormSelect
              field='PREOD_PAYMENTFORM_ZALO'
              list={mapDataOptions4Select(watch('payment_form_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Hình thức thanh toán Payoo' isRequired={true} disabled={false}>
            <FormSelect
              field='PREOD_PAYMENTFORM_PAY'
              list={mapDataOptions4Select(watch('payment_form_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Hình thức thanh toán VNPay' isRequired={true} disabled={false}>
            <FormSelect
              field='PREOD_PAYMENTFORM_VN'
              list={mapDataOptions4Select(watch('payment_form_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Hình thức thanh toán OnePay' isRequired={true} disabled={false}>
            <FormSelect
              field='PREOD_PAYMENTFORM_ONE'
              list={mapDataOptions4Select(watch('payment_form_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Hình thức thanh toán tiền mặt' isRequired={true} disabled={false}>
            <FormSelect
              field='PREOD_PAYMENTFORM_CASH'
              list={mapDataOptions4Select(watch('payment_form_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default PaymentType;
