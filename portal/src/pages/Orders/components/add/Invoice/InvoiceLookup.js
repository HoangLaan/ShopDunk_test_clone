import BWAccordion from 'components/shared/BWAccordion';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { useFormContext } from 'react-hook-form';

function InvoiceLookup({ title, disabled }) {
  const methods = useFormContext();
  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <FormItem label='Mã tra cứu HDDT' className='bw_col_4'>
          <div style={{ paddingBottom: '5px' }}></div>
          <span>{methods.watch('order_invoice_transaction') || ' '}</span>
          {!methods.watch('order_invoice_transaction') ? <div style={{ margin: '15px 0' }}></div> : null}
          <div style={{ paddingBottom: '5px' }}></div>
        </FormItem>
        <FormItem label='Đường dẫn tra cứu HDDT' className='bw_col_4'>
          <div style={{ paddingBottom: '5px' }}></div>
          <a target='_blank' rel='noreferrer' href={methods.watch('order_invoice_url') || ' '}>
            {methods.watch('order_invoice_url')}
          </a>
          {!methods.watch('order_invoice_url') ? <div style={{ margin: '15px 0' }}></div> : null}
          <div style={{ paddingBottom: '5px' }}></div>
          {/* <FormInput type='text' field='order_invoice_url' /> */}
        </FormItem>
      </div>
      <div className='bw_row'>
        <FormItem label='Ghi chú' className='bw_col_12' disabled>
          <FormTextArea
            style={{ maxWidth: '100%', minWidth: '100%' }}
            rows={3}
            field='description'
            placeholder='Nhập thông tin ghi chú'
          />
        </FormItem>
      </div>
    </BWAccordion>
  );
}

export default InvoiceLookup;
