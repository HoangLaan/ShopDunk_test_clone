import React, { useState, useCallback, useEffect } from 'react';
import { getList } from 'services/origin.setvice';

import OriginTable from './components/OriginTable';
import OriginFilter from './components/OriginFilter';

const OriginPage = () => {
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

  const loadFunction = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadFunction, [loadFunction]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <OriginFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <OriginTable
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
          loading={loading}
          onRefresh={loadFunction}
        />
      </div>
      {/* <ConfirmModal /> */}
    </React.Fragment>
  );
};

export default OriginPage;
