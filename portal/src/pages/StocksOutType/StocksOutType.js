import React, { useCallback, useEffect, useState } from 'react';
import StocksOutTypeFilter from './components/StocksOutTypeFilter';
import StocksOutTypeTable from './components/StocksOutTypeTable';
import { getListStocksOutType } from './helpers/call-api';

const StocksOutType = () => {
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    is_active: 1,
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

  const getData = useCallback(() => {
    setLoading(true);
    getListStocksOutType(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(getData, [getData]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <StocksOutTypeFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <StocksOutTypeTable
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
          onRefresh={getData}
        />
      </div>
    </React.Fragment>
  );
};

export default StocksOutType;
