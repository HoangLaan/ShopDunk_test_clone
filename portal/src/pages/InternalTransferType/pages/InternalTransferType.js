import React, { useState } from 'react';
import InternalTransferTypeTable from '../components/Tables/InternalTransferTypeTable';
import InternalTransferTypeFilter from '../components/Filters/InternalTransferTypeFilter';
import PageProvider from '../components/PageProvider/PageProvider';
import { LARGE_LIST_PARAMS } from 'utils/constants';

function InternalTransferType() {
  const [params, setParams] = useState(LARGE_LIST_PARAMS);
  const onClearParams = () => setParams(LARGE_LIST_PARAMS);
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));
  const onChangePage = (page) => setParams((prev) => ({ ...prev, page }));

  return (
    <PageProvider>
      <div className='bw_main_wrapp'>
        <InternalTransferTypeFilter onChange={onChange} onClearParams={onClearParams} />
        <InternalTransferTypeTable params={params} onChangePage={onChangePage} />
      </div>
    </PageProvider>
  );
}

export default InternalTransferType;
