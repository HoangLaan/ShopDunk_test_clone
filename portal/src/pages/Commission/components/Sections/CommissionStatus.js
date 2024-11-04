import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWAccordion from 'components/shared/BWAccordion/index';

function CommissionStatus({ title, disabled }) {
  const { watch } = useFormContext();

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_active' value={watch('is_active')} />
                <span />
                Kích hoạt
              </label>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
}

export default CommissionStatus;
