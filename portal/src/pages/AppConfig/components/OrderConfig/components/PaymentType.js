import React from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { mapDataOptions4Select } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';

const PaymentType = () => {
  const methods = useFormContext();
  const { watch } = methods;
  return (
    <BWAccordion title='Cài đặt hình thức thanh toán' id='bw_payment_type_config' isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem label='Chính sách thanh toán' isRequired={true} disabled={false}>
            <FormTextArea field='PAYMENT_POLICY' />
          </FormItem>
          <FormItem label='Hình thức thanh toán POS VTB' isRequired={true} disabled={false}>
            <FormSelect field='PAYMENTFORM_POS_VTB' list={mapDataOptions4Select(watch('payment_form_option'))} />
          </FormItem>
          <FormItem label='Hình thức thanh toán Shopee Pay' isRequired={true} disabled={false}>
            <FormSelect
              field='PAYMENTFORM_PARTNER_SHOPEEPAY'
              list={mapDataOptions4Select(watch('payment_form_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Hình thức thanh toán Vnpay' isRequired={true} disabled={false}>
            <FormSelect
              field='PAYMENTFORM_PARTNER_VNPAY'
              list={mapDataOptions4Select(watch('payment_form_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Hình thức thanh toán POS VNPAY' isRequired={true} disabled={false}>
            <FormSelect
              field='PAYMENTFORM_POS_VNPAY'
              list={mapDataOptions4Select(watch('payment_form_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Hình thức thanh toán One pay' isRequired={true} disabled={false}>
            <FormSelect
              field='PAYMENTFORM_PARTNER_ONEPAY'
              list={mapDataOptions4Select(watch('payment_form_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Hình thức thanh toán  Zalopay' isRequired={true} disabled={false}>
            <FormSelect
              field='PAYMENTFORM_PARTNER_ZALOPAY'
              list={mapDataOptions4Select(watch('payment_form_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Hình thức thanh toán POS VCB' isRequired={true} disabled={false}>
            <FormSelect
              field='PAYMENTFORM_POS_VCB'
              list={mapDataOptions4Select(watch('payment_form_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Hình thức thanh toán Momo' isRequired={true} disabled={false}>
            <FormSelect
              field='PAYMENTFORM_PARTNER_MOMO'
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
