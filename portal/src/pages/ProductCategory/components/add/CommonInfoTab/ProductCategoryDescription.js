import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormEditor from 'components/shared/BWFormControl/FormEditor';

const ProductCategoryDescription = ({ disabled, title }) => {
  return (
    <BWAccordion title={title} id='bw_info'>
      <div className='bw_row'>
        <FormEditor disabled={disabled} field='description' />
      </div>
    </BWAccordion>
  );
};

export default ProductCategoryDescription;
