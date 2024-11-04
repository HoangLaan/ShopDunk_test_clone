import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

const NewsStatus = ({ title, id, disabled }) => {
  const { watch } = useFormContext();
  const isAutoReview = useMemo(() => watch('is_active') ?? true, [watch('is_active')]);

  return (
    <BWAccordion title={title} id={id} isRequired={false}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox bw_col_2'>
                <FormInput type='checkbox' field='is_active' disabled={disabled} checked={isAutoReview}/>
                <span />
                Kích hoạt
              </label>
              <label className='bw_checkbox bw_col_2'>
                <FormInput type='checkbox' field='includeinfootercolumn1' disabled={disabled} />
                <span />
                Cột 1 footer
              </label>

              <label className='bw_checkbox bw_col_2'>
                <FormInput type='checkbox' field='includeinfootercolumn2' disabled={disabled} />
                <span />
                Cột 2 footer
              </label>
              
              <label className='bw_checkbox bw_col_2'>
                <FormInput type='checkbox' field='includeinfootercolumn3' disabled={disabled} />
                <span />
                Cột 3 footer
              </label>
              
             
              <label className='bw_checkbox bw_col_2'>
                <FormInput type='checkbox' field='includeintopmenu' disabled={disabled} />
                <span />
                Hiển thị top menu
              </label>


            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default NewsStatus;
