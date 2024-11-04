import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';

const jsx_address = () => (
  <div className='bw_col_12'>
    <FormItem label='Địa chỉ'>
      <FormInput placeholder={'Địa chỉ'} field={'address_receiver'} />
    </FormItem>
  </div>
);

export default jsx_address;
