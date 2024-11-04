import React, { useEffect, useMemo, useState } from 'react';
//until
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { useFormContext, useForm } from 'react-hook-form';

export default function GroupServiceStatusInfo({ disabled }) {
  const { setValue, watch, control, unregister } = useFormContext();
  const isAutoReview = useMemo(() => watch('is_active') ?? true, [watch('is_active')]);
  const isAutoshow = useMemo(() => watch('is_show_web') ?? true, [watch('is_show_web')]);

  return (
    <BWAccordion title='Trạng thái' isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center'>
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_active' disabled={disabled} checked={isAutoReview}/>
                <span />
                Kích hoạt
              </label>
            </div>
          </div>
        </div>
        <div className='bw_col_6'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center '>
              <label className='bw_checkbox'>
              <FormInput type='checkbox' field='is_show_web' disabled={disabled} checked={isAutoshow}/>
                <span />
                Hiển thị web
              </label>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
}
