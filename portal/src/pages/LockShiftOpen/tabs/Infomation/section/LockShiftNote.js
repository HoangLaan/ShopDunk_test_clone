import BWAccordion from 'components/shared/BWAccordion/index';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormItem from 'components/shared/BWFormControl/FormItem';

import React from 'react';
import {useFormContext} from "react-hook-form";

const LockShiftNote = ({ title, disabled }) => {
  return (
    <BWAccordion title={title} id='bw_info_cus'>
      <div className='bw_row'>
        <FormItem label='Ghi chú' className='bw_col_12' disabled={disabled}>
          <FormTextArea field={"shift_note"}  />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default LockShiftNote;
