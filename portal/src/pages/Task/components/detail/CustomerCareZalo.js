import React from 'react';
import FormZalo from 'components/shared/FormZalo/FormZalo';

function CustomerCareZalo({ methods, customer = {} }) {
  return (
    <div className='bw_tab_items bw_active'>
      <FormZalo customer={customer} methods={methods} />
    </div>
  );
}

export default CustomerCareZalo;
