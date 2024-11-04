import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const jsx_supplier = ({ supplierOptions = [] }) => {
  return (
    <div className='bw_col_4'>
      <FormItem disabled={true} isRequired label='Nhà cung cấp'>
        <FormSelect list={supplierOptions} field={'supplier_id'} />
      </FormItem>
    </div>
  );
};

export default jsx_supplier;
