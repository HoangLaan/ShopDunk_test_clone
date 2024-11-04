import React, { useState, useCallback, useEffect } from 'react';

import { getListReceiveType } from 'services/receive-type.service';
import ReceiveTypeTable from './components/main/ReceiveTypeTable';
import ReceiveTypeFilter from './components/main/ReceiveTypeFilter';

const ReceiveTypePage = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 10,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadReceiveType = useCallback(() => {
    setLoading(true);
    getListReceiveType(params)
      .then(setDataList)
      .catch((_) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadReceiveType, [loadReceiveType]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <ReceiveTypeFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <ReceiveTypeTable
          loading={loading}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          onRefresh={loadReceiveType}
          params={params}
        />
      </div>
    </React.Fragment>
  );
};

export default ReceiveTypePage;
