import React, { useState } from 'react';
import PurchaseRequisitionTypeTable from '../components/Tables/PurchaseRequisitionTypeTable';
import PurchaseRequisitionTypeFilter from '../components/Filters/PurchaseRequisitionTypeFilter';
import PageProvider from '../components/PageProvider/PageProvider';
import { LARGE_LIST_PARAMS } from 'utils/constants';

function PurchaseRequisitionType() {
  const [params, setParams] = useState(LARGE_LIST_PARAMS);
  const onClearParams = () => setParams(LARGE_LIST_PARAMS);
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));
  const onChangePage = (page) => setParams((prev) => ({ ...prev, page }));

  return (
    <PageProvider>
      <div className='bw_main_wrapp'>
        <PurchaseRequisitionTypeFilter onChange={onChange} onClearParams={onClearParams} />
        <PurchaseRequisitionTypeTable params={params} onChangePage={onChangePage} />
      </div>
    </PageProvider>
  );
}

export default PurchaseRequisitionType;
