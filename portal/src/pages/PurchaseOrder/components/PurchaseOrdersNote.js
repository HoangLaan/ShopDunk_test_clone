import BWAccordion from 'components/shared/BWAccordion/index';
import FormEditor from 'components/shared/BWFormControl/FormEditor';
import React from 'react';

const PurchaseOrdersNote = ({ disabled }) => {
  return (
    <BWAccordion title='Ghi chú' id='bw_note'>
      <FormEditor field='order_note' disabled={disabled} />
    </BWAccordion>
  );
};
export default PurchaseOrdersNote;
