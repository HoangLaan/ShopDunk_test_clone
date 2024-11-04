import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';

const CostTypeMethod = ({ disabled, title, id }) => {
  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_12 bw_mb_2'>
          <label class='bw_checkbox bw_has_vat'>
            <FormInput type='checkbox' field='is_discount' disabled={disabled} />
            <span />
            Giảm giá
          </label>
        </div>

        <div class='bw_col_12 bw_mb_2'>
          <label class='bw_checkbox bw_has_vat'>
            <FormInput type='checkbox' field='is_percent' disabled={disabled} />
            <span />
            Theo phần trăm
          </label>
        </div>
      </div>

    </BWAccordion>
  );
};

export default CostTypeMethod;
