import React, { useState } from 'react';
import TableCustomerCare from 'pages/CustomerCare/components/Tables/TableCustomerCare';
import FilterCustomerCare from '../components/Filters/FilterCustomerCare';
import { StyledCustomerCare } from '../utils/styles';

function CustomerCare() {
  const [params, setParams] = useState({ is_active: 1, page: 1, itemsPerPage: 25, search_type: 3 });
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));
  const onClear = (p) => setParams({ is_active: 1, page: 1, itemsPerPage: 25 })

  return (
    <StyledCustomerCare>
      <div className='bw_main_wrapp'>
        <FilterCustomerCare onChange={onChange} onClear={onClear} />
        <TableCustomerCare params={params} onChange={onChange} />
      </div>
    </StyledCustomerCare>
  );
}

export default CustomerCare;
