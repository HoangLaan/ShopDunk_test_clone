import React, { useCallback, useState, useEffect } from 'react';
import OffworkManagementFilter from '../components/OffworkManagementFilter';
import { getList } from 'services/offwork-management.service';
import { defaultPaging, defaultParams, showToast } from 'utils/helpers';
import OffworkManagementTable from '../components/OffworkManagementTable';
const OffWorkManagementPage = () => {
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    keyword: '',
    is_active: 1,
  });
  const [dataItem, setDataItem] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataItem;

  const loadPolicy = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataItem)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(() => {
    loadPolicy();
  }, [loadPolicy]);

  const onChangePage = (page) => setParams((prev) => {
    return { ...prev, ...page }});

  const onClearParams = () => setParams(defaultParams);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <OffworkManagementFilter
          onChange={(p) => {
            setParams({
              ...params,
              ...p,
            });
          }}
        />
        <OffworkManagementTable
           onChangePage={onChangePage}
           data={items}
           totalPages={totalPages}
           itemsPerPage={itemsPerPage}
           page={page}
           totalItems={totalItems}
           loading={loading}
           onRefresh={loadPolicy}/>
      </div>
    </React.Fragment>
  );
};

export default OffWorkManagementPage;
