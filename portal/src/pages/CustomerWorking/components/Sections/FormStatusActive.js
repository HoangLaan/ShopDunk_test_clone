import React from 'react';

import FormInput from 'components/shared/BWFormControl/FormInput';
import BWAccordion from 'components/shared/BWAccordion/index';

const FormStatusActive = ({ disabled, hiddenActive }) => {
  return (
    <BWAccordion title='Trạng thái'>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
              {!hiddenActive && (
                <div className="bw_flex bw_align_items_center">
                  <label className='bw_checkbox'>
                    <FormInput disabled={disabled} type='checkbox' field='is_active' />
                    <span />
                    Kích hoạt
                  </label>
                  <label className='bw_checkbox'>
                    <FormInput disabled={disabled} type='checkbox' field='is_system' />
                    <span />
                      Hệ thống
                  </label>
                </div>
              )}
            </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default FormStatusActive;
