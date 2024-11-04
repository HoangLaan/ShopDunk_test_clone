import React, { useEffect } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import ApplyForOrderComponent from './FormDetail/ApplyForOrder';
import ApplyForProductComponent from './FormDetail/ApplyForProduct';
import { useFormContext } from 'react-hook-form';

const InstallmentFormInfo = ({ disabled, title, id }) => {
  const methods = useFormContext();
  const { watch, getValues, reset, clearErrors } = methods;

  useEffect(() => {
    if (!getValues('is_apply_order')) {
      reset({ ...getValues(), total_money_form: undefined, total_money_to: undefined });
    }
    clearErrors('total_money_form');
    clearErrors('total_money_to');
  }, [watch('is_apply_order')]);

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row' style={{ gap: '4px' }}>
        <div class='bw_col_12'>
          <label className='bw_checkbox' style={{ width: 'fit-content' }}>
            <FormInput type='checkbox' field='is_apply_order' disabled={disabled} />
            <span />
            Áp dụng cho đơn hàng
          </label>
        </div>
        {methods.watch('is_apply_order') ? <ApplyForOrderComponent /> : null}

        <div class='bw_col_12 '>
          <label className='bw_checkbox' style={{ width: 'fit-content' }}>
            <FormInput type='checkbox' field='is_apply_product' disabled={disabled} />
            <span />
            Áp dụng cho sản phẩm
          </label>
        </div>
        {methods.watch('is_apply_product') ? <ApplyForProductComponent /> : null}
      </div>
    </BWAccordion>
  );
};

export default InstallmentFormInfo;
