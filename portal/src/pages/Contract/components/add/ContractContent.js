import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormEditor from 'components/shared/BWFormControl/FormEditor';

const ContractContent = ({ disabled, title }) => {
  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <FormEditor
            field='content'
            disabled={disabled}
            validation={{
              required: 'Nội dung là bắt buộc',
            }}
          />
        </div>
      </div>
    </BWAccordion>
  );
};
export default ContractContent;
