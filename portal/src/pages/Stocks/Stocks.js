import React, { useCallback, useEffect, useState } from 'react';
import StocksFilter from './components/StocksFilter';
import StocksTable from './components/StocksTable';
import { getListStocks } from './helpers/call-api';

const Stocks = () => {
  const defaultParams = { page: 1, itemsPerPage: 25, is_active: 1 };
  const [params, setParams] = useState(defaultParams);

  const onClearParams = () => setParams(defaultParams);

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
    getListStocks(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(getData, [getData]);

  const onChangePage = (page) =>
    setParams((prev) => {
      return { ...prev, page };
    });

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <StocksFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
          onClearParams={onClearParams}
        />
        <StocksTable
          key={items}
          onChangePage={onChangePage}
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

export default Stocks;
