import React, { useState, useCallback, useEffect } from 'react';
import StocksTakeRequestTable from 'pages/StocksTakeRequest/components/data-table/StocksTakeRequestTable';
import StocksTakeRequestFilter from 'pages/StocksTakeRequest/components/data-table/StocksTakeRequestFilter';
import { useDispatch } from 'react-redux';
import { getStockTakeRequests, getStockTakeTypes } from 'pages/StocksTakeRequest/actions';
import { REVIEW_TYPES } from 'pages/StocksTakeRequest/utils/constants';

const StocksTakeRequestPage = () => {
  const [params, setParams] = useState({
    is_active: 1,
    is_reviewed: REVIEW_TYPES.ALL,
  });

  const dispatch = useDispatch();

  const loadStocksTakeRequest = useCallback(() => {
    dispatch(getStockTakeRequests(params));
  }, [dispatch, params]);
  useEffect(loadStocksTakeRequest, [loadStocksTakeRequest]);

  // const loadStocksTakeType = useCallback(() => {
  //   if (stocksTakeTypeList?.length === 0) dispatch(getStockTakeTypes());
  // }, [dispatch, stocksTakeTypeList]);

  // hot fix loop call api
  const loadStocksTakeType = useCallback(() => {
    dispatch(getStockTakeTypes());
  }, [dispatch]);
  useEffect(loadStocksTakeType, [loadStocksTakeType]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <StocksTakeRequestFilter
          onChange={(value) => {
            setParams((prev) => ({
              ...prev,
              ...value,
            }));
          }}
          onClear={() => {
            setParams({
              is_active: 1,
            });
          }}
        />
        <StocksTakeRequestTable
          onChangeParams={(data) => {
            setParams((prev) => ({
              ...prev,
              ...data,
            }));
          }}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          onRefresh={loadStocksTakeRequest}
        />
      </div>
    </React.Fragment>
  );
};

export default StocksTakeRequestPage;
