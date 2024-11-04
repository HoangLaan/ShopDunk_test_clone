import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import React from 'react';

const CareServiceStatus = ({ title, id, disabled }) => {
  return (
    <BWAccordion title={title} id={id} isRequired={false}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox bw_col_2'>
                <FormInput type='checkbox' field='is_active' disabled={disabled} />
                <span />
                Kích hoạt
              </label>
              <label className='bw_checkbox bw_col_2'>
                <FormInput type='checkbox' field='is_stop_selling' disabled={disabled} />
                <span />
                Dừng bán
              </label>
              <label className='bw_checkbox bw_col_2'>
                <FormInput type='checkbox' field='is_hot' disabled={disabled} />
                <span />
                Dịch vụ nổi bật
              </label>
              
              <label className='bw_checkbox bw_col_2'>
                <FormInput type='checkbox' field='is_showweb' disabled={disabled} />
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

export default CareServiceStatus;
