import React, { useState } from 'react';
import PurchaseOrderDivisionTable from '../components/Tables/PurchaseOrderDivisionTable';
import PurchaseOrderDivisionFilter from '../components/Filters/PurchaseOrderDivisionFilter';
import PageProvider from '../components/PageProvider/PageProvider';
import { LARGE_LIST_PARAMS } from 'utils/constants';

function PurchaseOrderDivision() {
  const [params, setParams] = useState(LARGE_LIST_PARAMS);
  const onClearParams = () => setParams(LARGE_LIST_PARAMS);
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));
  const onChangePage = (page) => setParams((prev) => ({ ...prev, page }));

  return (
    <PageProvider>
      <div className='bw_main_wrapp'>
        <PurchaseOrderDivisionFilter onChange={onChange} onClearParams={onClearParams} />
        <PurchaseOrderDivisionTable params={params} onChangePage={onChangePage} />
      </div>
    </PageProvider>
  );
}

export default PurchaseOrderDivision;
