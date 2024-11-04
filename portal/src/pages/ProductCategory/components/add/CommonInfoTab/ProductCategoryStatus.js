import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';

const ProductCategoryStatus = ({ disabled, title }) => {
  return (
    <BWAccordion title={title} id='bw_info' isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
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

              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_show_web' />
                <span />
                Hiển thị web
              </label>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default ProductCategoryStatus;
