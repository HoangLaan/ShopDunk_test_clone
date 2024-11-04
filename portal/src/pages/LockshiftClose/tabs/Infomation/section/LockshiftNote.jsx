import BWAccordion from 'components/shared/BWAccordion/index';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormItem from 'components/shared/BWFormControl/FormItem';

import React from 'react';

const LockshiftNote = ({ title, disabled }) => {
  return (
    <BWAccordion title={title} id='bw_info_cus'>
      <div className='bw_row'>
        <FormItem label='Ghi chú' className='bw_col_12' disabled={disabled}>
          <FormTextArea field='note' />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default LockshiftNote;
