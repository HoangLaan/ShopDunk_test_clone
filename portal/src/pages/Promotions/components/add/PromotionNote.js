import React from 'react';

import BWAccordion from 'components/shared/BWAccordion';
import FormTextArea from "components/shared/BWFormControl/FormTextArea";
import FormItem from 'components/shared/BWFormControl/FormItem';

const PromotionNote = ({ disabled }) => {
  return (
    <BWAccordion title='Ghi chú'>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
          <FormItem className='bw_col_12' disabled={disabled} label='Ghi chú'>
            <FormTextArea
              disabled={disabled}
              field='note'
            />
          </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default PromotionNote;

