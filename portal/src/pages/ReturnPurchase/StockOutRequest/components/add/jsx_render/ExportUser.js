import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const jsx_export_user = ({ userOptions = [] }) => {
  return (
    <div className='bw_col_4'>
      <FormItem label='Người xuất'>
        <FormSelect field={'export_user'} list={userOptions} />
      </FormItem>
    </div>
  );
};

export default jsx_export_user;
