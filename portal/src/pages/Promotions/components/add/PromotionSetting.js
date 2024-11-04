import React from 'react';

import BWAccordion from 'components/shared/BWAccordion';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useFormContext } from 'react-hook-form';

const PromotionSetting = ({ disabled }) => {
  const methods = useFormContext();
  return (
    <BWAccordion title='Thiết lập khác'>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_row bw_flex bw_align_items_center'>
              <div className='bw_col_6'>
                <FormItem>
                  <label className='bw_checkbox'>
                    <FormInput disabled={disabled} type='checkbox' field='is_apply_with_order_promotion' />
                    <span />
                    Được áp dụng với chương trình khuyến mại khác
                  </label>
                </FormItem>
              </div>
              <div className='bw_col_4'>
                <FormItem>
                  <label className='bw_checkbox'>
                    <FormInput disabled={disabled} type='checkbox' field='is_reward_point' />
                    <span />
                    Có nhận điểm thưởng
                  </label>
                </FormItem>
              </div>
            </div>
            <div className='bw_row bw_flex bw_align_items_center'>
              <div className='bw_col_6'>
                <FormItem>
                  <div>
                    <label className='bw_checkbox'>
                      <FormInput disabled={disabled} type='checkbox' field='is_limit_promotion_times' />
                      <span />
                      Giới hạn số lần khuyến mại trên 1 khách hàng
                    </label>
                  </div>
                </FormItem>
              </div>
              <div className='bw_col_3'>
                {Boolean(methods.watch('is_limit_promotion_times')) && (
                  <div className='bw_col_12'>
                    <FormNumber bordered addonAfter='lần' field='max_promotion_times' disabled={disabled} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default PromotionSetting;
