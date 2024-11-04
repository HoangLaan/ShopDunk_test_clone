import React, { useCallback, useEffect, useState } from 'react';
import StocksTakeTypeFilter from './components/StocksTakeTypeFilter';
import StocksTakeTypeTable from './components/StocksTakeTypeTable';
import { getListStocksTakeType } from './helpers/call-api';

const StocksTakeType = () => {
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

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const [loading, setLoading] = useState(true);

  const getData = useCallback(() => {
    setLoading(true);
    getListStocksTakeType(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(getData, [getData]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <StocksTakeTypeFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <StocksTakeTypeTable
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

export default StocksTakeType;
