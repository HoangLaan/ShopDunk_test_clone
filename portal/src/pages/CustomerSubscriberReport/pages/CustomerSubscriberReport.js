import React, { useState } from 'react';
import CustomerSubscriberReportTable from '../components/Tables/CustomerSubscriberReportTable';
import CustomerSubscriberReportFilter from '../components/Filters/CustomerSubscriberReportFilter';
import PageProvider from '../components/PageProvider/PageProvider';
import { LARGE_LIST_PARAMS } from 'utils/constants';

function CustomerSubscriberReport() {
  const [params, setParams] = useState(LARGE_LIST_PARAMS);
  const onClearParams = () => setParams(LARGE_LIST_PARAMS);
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));
  const onChangePage = (page) => setParams((prev) => ({ ...prev, page }));

  return (
    <PageProvider>
      <div className='bw_main_wrapp'>
        <CustomerSubscriberReportFilter onChange={onChange} onClearParams={onClearParams} />
        <CustomerSubscriberReportTable params={params} onChangePage={onChangePage} />
      </div>
    </PageProvider>
  );
}

export default CustomerSubscriberReport;
