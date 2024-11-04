import React, { useState, useCallback, useEffect } from 'react';
import { getListStocksOut, getStocksOutRequestByOrder } from 'services/stocks-out-request.service';
import StocksOutTable from 'pages/StocksOutRequest/components/main/StocksOutTable';
import StocksOutFilter from 'pages/StocksOutRequest/components/main/StocksOutFilter';
import { defaultPaging, defaultParams } from 'utils/helpers';

const StocksOutRequestPage = ({location}) => {
  const order_id  = location?.state?.order_id;

  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;
  const [isFilterPreOder, setIsFilterPreOder] = useState(false);
  const loadStocksOut = useCallback(() => {
    setLoading(true);
    if(order_id){
      getStocksOutRequestByOrder(order_id)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
    }else{
      getListStocksOut(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
    }
  }, [params]);
  useEffect(loadStocksOut, [loadStocksOut]);


  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <StocksOutFilter
          onClear={() => {
            setParams(defaultParams);
          }}
          setIsFilterPreOder={setIsFilterPreOder}
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
                created_user: e?.created_user?.value,
              };
            });
          }}
        />
        <StocksOutTable
          isFilterPreOder={isFilterPreOder}
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
          onRefresh={loadStocksOut}
        />
      </div>
    </React.Fragment>
  );
};

export default StocksOutRequestPage;
