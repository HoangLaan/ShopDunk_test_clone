import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormTargetCare from '../Forms/FormTargetCare';
import FormFrequencyCare from '../Forms/FormFrequencyCare';

const CustomerCareTypeInformation = ({ disabled, title }) => {
  return (
    <BWAccordion title={title}>
      <div className='bw_row bw_from_care_type_information'>
        <div className='bw_col_6'>
          <FormFrequencyCare disabled={disabled} />
        </div>
        <div className='bw_col_6'>
          <FormTargetCare disabled={disabled} />
        </div>
      </div>
    </BWAccordion>
  );
};

export default CustomerCareTypeInformation;
