import React, { useState } from 'react';
import InterestContentTable from '../components/Tables/InterestContentTable';
import InterestContentFilter from '../components/Filters/InterestContentFilter';
import PageProvider from '../components/PageProvider/PageProvider';
import { LARGE_LIST_PARAMS } from 'utils/constants';

function InterestContent() {
  const [params, setParams] = useState(LARGE_LIST_PARAMS);
  const onClearParams = () => setParams(LARGE_LIST_PARAMS);
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));
  const onChangePage = (page) => setParams((prev) => ({ ...prev, page }));

  return (
    <PageProvider>
      <div className='bw_main_wrapp'>
        <InterestContentFilter onChange={onChange} onClearParams={onClearParams} />
        <InterestContentTable params={params} onChangePage={onChangePage} />
      </div>
    </PageProvider>
  );
}

export default InterestContent;
