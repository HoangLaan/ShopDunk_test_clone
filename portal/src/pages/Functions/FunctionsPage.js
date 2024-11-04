import React, { useState, useCallback, useEffect } from 'react';
import { getList } from 'services/function.service';

import FunctionsTable from './components/FunctionsTable';
import FunctionsFilter from './components/FunctionsFilter';

const FunctionsPage = () => {
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
        <FunctionsFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <FunctionsTable
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

export default FunctionsPage;
