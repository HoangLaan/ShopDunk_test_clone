import React, { useCallback, useState } from 'react';
import TableCustomerWorking from 'pages/CustomerWorking/components/Tables/TableCustomerWorking';
import FilterCustomerWorking from 'pages/CustomerWorking/components/Filters/FilterCustomerWorking';
import PageProvider from '../components/PageProvider/PageProvider';

function CustomerLead() {
  const [params, setParams] = useState({ is_active: 1, page: 1, itemsPerPage: 25 });
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));

  return (
    <PageProvider>
      <div className='bw_main_wrapp'>
        <FilterCustomerWorking onChange={(p) => setParams({ ...params, ...p })} />
        <TableCustomerWorking params={params} onChange={onChange} />
      </div>
    </PageProvider>
  );
}

export default CustomerLead;
