import React, { useState } from 'react';
import CustomerDepositTable from '../components/Tables/CustomerDepositTable';
import CustomerDepositFilter from '../components/Filters/CustomerDepositFilter';
import PageProvider from '../components/PageProvider/PageProvider';
import { LARGE_LIST_PARAMS } from 'utils/constants';

function CustomerDeposit() {
  const [params, setParams] = useState(LARGE_LIST_PARAMS);
  const onClearParams = () => setParams(LARGE_LIST_PARAMS);
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));
  const onChangePage = (page) => setParams((prev) => ({ ...prev, page }));

  return (
    <PageProvider>
      <div className='bw_main_wrapp'>
        <CustomerDepositFilter onChange={onChange} onClearParams={onClearParams} />
        <CustomerDepositTable params={params} onChangePage={onChangePage} onChange={onChange} />
      </div>
    </PageProvider>
  );
}

export default CustomerDeposit;
