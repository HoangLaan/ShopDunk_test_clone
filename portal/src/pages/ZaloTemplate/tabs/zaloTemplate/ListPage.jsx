import React, { useState } from 'react';
import ZaloTemplateTable from '../../components/Tables/ZaloTemplateTable';
import ZaloTemplateFilter from '../../components/Filters/ZaloTemplateFilter';
import PageProvider from '../../components/PageProvider/PageProvider';
import { LARGE_LIST_PARAMS } from 'utils/constants';

function ZaloTemplate() {
  const [params, setParams] = useState(LARGE_LIST_PARAMS);
  const onClearParams = () => setParams(LARGE_LIST_PARAMS);
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));
  const onChangePage = (page) => setParams((prev) => ({ ...prev, page }));

  return (
    <PageProvider>
      <div className='bw_main_wrapp'>
        <ZaloTemplateFilter onChange={onChange} onClearParams={onClearParams} />
        <ZaloTemplateTable params={params} onChangePage={onChangePage} />
      </div>
    </PageProvider>
  );
}

export default ZaloTemplate;
