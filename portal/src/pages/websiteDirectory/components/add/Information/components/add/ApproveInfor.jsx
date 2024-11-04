import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

const NewsStatus = ({ title, website_category_id, disabled }) => {
  const methods = useFormContext({});
  const { setValue } = methods;
  useEffect(() => {
    setValue('is_active', true);
    setValue('is_top_menu', false);
    setValue('is_footer', false);
  }, [setValue]);
  return (
    <BWAccordion title={title} id={website_category_id} isRequired={false}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox bw_col_6'>
                <FormInput type='checkbox' field='is_active' />
                <span />
                Kích hoạt
              </label>
              <label className='bw_checkbox bw_col_6'>
                <FormInput type='checkbox' field='is_top_menu' />
                <span />
                Hiển thị top menu
              </label>
              <label className='bw_checkbox bw_col_6'>
                <FormInput type='checkbox' field='is_footer' />
                <span />
                Hiển thị footer menu
              </label>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default NewsStatus;
