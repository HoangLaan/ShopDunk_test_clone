import React, { useState, useCallback, useEffect } from 'react';

import BusinessFilter from './components/BusinessFilter';
import BusinessTable from './components/BusinessTable';
import { getList } from 'services/business.service';

const BusinessPage = () => {
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadFunctionGroup = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadFunctionGroup, [loadFunctionGroup]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <BusinessFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <BusinessTable
          loading={loading}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onRefresh={loadFunctionGroup}
        />
      </div>
    </React.Fragment>
  );
};

export default BusinessPage;
