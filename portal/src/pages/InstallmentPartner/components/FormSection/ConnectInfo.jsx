import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { useFormContext } from 'react-hook-form';
import FormItem from 'components/shared/BWFormControl/FormItem';

const ConnectInfo = ({ disabled, title, id }) => {
  const methods = useFormContext();

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_6'>
          <FormItem disabled={disabled} label='Shop ID'>
            <FormInput type='text' field='shop_id' placeholder='Nhập shop id' disabled={disabled} />
          </FormItem>
        </div>
        <div class='bw_col_6'>
          <FormItem disabled={disabled} label='Private Code'>
            <FormInput type='text' field='private_code' placeholder='Nhập private code' disabled={disabled} />
          </FormItem>
        </div>
        <div class='bw_col_6'>
          <FormItem disabled={disabled} label='Merchant Code'>
            <FormInput type='text' field='merchant_code' placeholder='Nhập marchant code' disabled={disabled} />
          </FormItem>
        </div>
        <div class='bw_col_6'>
          <FormItem disabled={disabled} label='Merchant Private Code'>
            <FormInput
              type='text'
              field='merchant_private_code'
              placeholder='Nhập marchant private code'
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div class='bw_col_6'>
          <FormItem disabled={disabled} label='End point'>
            <FormInput type='text' field='end_point' placeholder='Nhập end point' disabled={disabled} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default ConnectInfo;
