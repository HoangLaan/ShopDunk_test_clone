import React from 'react';
import { useFormContext } from 'react-hook-form';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWAccordion from 'components/shared/BWAccordion/index';

function CommissionMore({ title, disabled }) {
  const { watch, setValue } = useFormContext();
  const watchIsAutoRenew = watch('is_auto_renew');

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center'>
              <label className='bw_checkbox'>
                <FormInput
                  disabled={disabled}
                  type='checkbox'
                  field='is_auto_renew'
                  onChange={({ target: { checked } }) => {
                    setValue('is_auto_renew', checked);
                  }}
                />
                <span />
                Tự động gia hạn chương trình
              </label>
            </div>
          </div>
        </div>
        {!!watchIsAutoRenew && (
          <div className='bw_col_12'>
            <FormItem label='Ngày gia hạn' isRequired={true}>
              <FormSelect
                field='renew_day_in_month'
                validation={{
                  required: 'Ngày gia hạn là bắt buộc',
                }}
                list={Array.from(Array(31).keys()).map((day) => ({
                  value: day + 1,
                  label: `Ngày ${day + 1}`,
                }))}
                placeholder='--Chọn ngày--'
                disabled={disabled}
              />
            </FormItem>
          </div>
        )}
        <div className='bw_col_12'>
          <FormItem label='Mô tả'>
            <FormTextArea rows={3} field='description' placeholder='Mô tả' disabled={disabled} />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center'>
              <label className='bw_checkbox'>
                <FormInput
                  disabled={disabled}
                  type='checkbox'
                  field='is_apply_other_commission'
                  value={watch('is_apply_other_commission')}
                />
                <span />
                Áp dụng với các chương trình hoa hồng khác
              </label>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
}

export default CommissionMore;
