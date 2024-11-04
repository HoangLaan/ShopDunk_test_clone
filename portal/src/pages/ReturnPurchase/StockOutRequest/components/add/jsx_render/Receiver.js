import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';

const jsx_receiver = () => (
  <div className='bw_col_4'>
    <FormItem label='Người nhận hàng'>
      <FormInput field={'user_receiver'} />
    </FormItem>
  </div>
);

export default jsx_receiver;
