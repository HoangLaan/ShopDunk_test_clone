import React from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { mapDataOptions4Select } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';

const DivideProduct = () => {
  const methods = useFormContext();
  const { watch } = methods;
  return (
    <BWAccordion title='Cài đặt chia hàng' id='bw_divide_product_config' isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem label='Loại kho' isRequired={true} disabled={false}>
            <FormSelect
              field='STOCKSTYPEDIVISION'
              list={mapDataOptions4Select(watch('stock_type_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Hình thức nhập kho' isRequired={true} disabled={false}>
            <FormSelect
              field='STOCKSINTYPEDIVISION'
              list={mapDataOptions4Select(watch('stock_in_type_option'))}
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

export default DivideProduct;
