import React, { useState } from 'react';
import CustomerCouponTable from '../components/Tables/CustomerCouponTable';
import CustomerCouponFilter from '../components/Filters/CustomerCouponFilter';
import PageProvider from '../components/PageProvider/PageProvider';
import { LARGE_LIST_PARAMS } from 'utils/constants';

const defaultParams = {
  ...LARGE_LIST_PARAMS,
  search_type: null,
  is_used: null,
  is_ordered: null,
};

function CustomerCoupon() {
  const [params, setParams] = useState(defaultParams);
  const onClearParams = () => setParams(defaultParams);
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));
  const onChangePage = (page) => setParams((prev) => ({ ...prev, page }));

  return (
    <PageProvider>
      <div className='bw_main_wrapp'>
        <CustomerCouponFilter onChange={onChange} onClearParams={onClearParams} />
        <CustomerCouponTable params={params} onChangePage={onChangePage} />
      </div>
    </PageProvider>
  );
}

export default CustomerCoupon;
