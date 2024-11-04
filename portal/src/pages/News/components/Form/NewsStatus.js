import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import React from 'react';

const NewsStatus = ({ title, id, disabled }) => {
  return (
    <BWAccordion title={title} id={id} isRequired={false}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              {/* <label className='bw_checkbox'>
                                <FormInput
                                    type='checkbox'
                                    field='is_video' disabled={disabled}
                                />
                                <span />
                                Tin video
                            </label>
                            <label className='bw_checkbox'>
                                <FormInput
                                    type='checkbox'
                                    field='is_high_light' disabled={disabled}
                                />
                                <span />
                                Tin nổi bật
                            </label>
                            <label className='bw_checkbox'>
                                <FormInput
                                    type='checkbox'
                                    field='is_show_product_gift' disabled={disabled}
                                />
                                <span />
                                Tin trang tặng quà
                            </label> */}
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_active' disabled={disabled} />
                <span />
                Kích hoạt
              </label>
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_system' disabled={disabled} />
                <span />
                Hệ thống
              </label>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default NewsStatus;
