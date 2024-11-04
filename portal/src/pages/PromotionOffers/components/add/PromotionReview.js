import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import TableReview from './TableReview';

function PromotionReview({ title, disabled, loadDetail }) {
  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <TableReview disabled={disabled} loadDetail={loadDetail} />
        </div>
      </div>
    </BWAccordion>
  );
}

export default PromotionReview;
