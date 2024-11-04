import React, { useCallback, useState, useEffect } from 'react';

import { getList } from 'services/lockshift-open.service';
import { defaultPaging, defaultParams, showToast } from 'utils/helpers';

import LockShiftTable from '../components/LockShiftTable';
import LockShiftFilter from '../components/LockShiftFilter';

const DefaultLockShiftOpenPage = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataItem, setDataItem] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataItem;

  const loadBudgets = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataItem)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const onChangePage = (page) => setParams((prev) => {
    return { ...prev, ...page }});

  const onClearParams = () => setParams(defaultParams);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <LockShiftFilter onChange={onChangePage} onClearParams={onClearParams} />
        <LockShiftTable
         onChangePage={onChangePage}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
        />
      </div>
    </React.Fragment>
  );
};

export default DefaultLockShiftOpenPage;
