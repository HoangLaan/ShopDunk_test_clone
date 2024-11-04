import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const jsx_purchase_user = ({ userOptions = [] }) => {
  return (
    <div className='bw_col_4'>
      <FormItem label='NV mua hàng' disabled={true}>
        <FormSelect field={'purchase_user'} list={userOptions} />
      </FormItem>
    </div>
  );
};

export default jsx_purchase_user;
