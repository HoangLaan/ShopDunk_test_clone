import React from 'react';
import { useFormContext } from 'react-hook-form';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';

import FormInput from 'components/shared/BWFormControl/FormInput';

const RequestPoStatus = ({ disabled }) => {
  const methods = useFormContext();

  return (
    <React.Fragment>
      <BWAccordion title='Trạng thái' id='bw_mores' isRequired={false}>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <div className='bw_frm_box'>
              <div className='bw_flex bw_align_items_center bw_lb_sex'>
                <label className='bw_checkbox'>
                  <FormInput type='checkbox' field='is_active' value={methods.watch('is_active')} disabled={disabled} />
                  <span />
                  Kích hoạt
                </label>
                <label className='bw_checkbox'>
                  <FormInput type='checkbox' field='is_system' value={methods.watch('is_system')} disabled={disabled} />
                  <span />
                  Hệ thống
                </label>
              </div>
            </div>
          </div>
        </div>
      </BWAccordion>
    </React.Fragment>
  );
};

export default RequestPoStatus;
