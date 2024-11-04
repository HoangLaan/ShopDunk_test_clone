import React from 'react';

import CheckAccess from 'navigation/CheckAccess';
import BWAccordion from 'components/shared/BWAccordion/index';

import TableReview from '../Tables/TableReview';
import { COMMISSION_PERMISSION } from 'pages/Commission/helpers/constants';

function CommissionReview({ title, disabled, commissionId }) {
  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <CheckAccess permission={COMMISSION_PERMISSION.REVIEW}>
            <TableReview disabled={disabled} />
          </CheckAccess>
        </div>
      </div>
    </BWAccordion>
  );
}

export default CommissionReview;
