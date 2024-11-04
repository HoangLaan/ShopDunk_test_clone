import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// services
import { getList } from 'services/stocks-in-request.service';
//components
import StocksInRequestTable from './components/Table';
import StocksInRequestFilter from './components/Filter';
import queryString from 'query-string';

const StocksInRequestPage = () => {
  const { search } = useLocation();
  const { product_imei_code } = queryString.parse(search);
  const defaultParams = {
    page: 1,
    itemsPerPage: 25,
    is_reviewed: 4,
    is_imported: 2,
    is_deleted: 0,
    created_user: null,
    search: '',
  };
  const [params, setParams] = useState(defaultParams);
  const onClearParams = () => setParams(defaultParams);

  useEffect(() => {
    if (product_imei_code) {
      setParams({
        ...params,
        search: product_imei_code,
      });
    }
  }, [params, product_imei_code]);
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadStocksInRequest = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadStocksInRequest, [loadStocksInRequest]);

  const onChangePage = (page) =>
    setParams((prev) => {
      return { ...prev, page };
    });

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <StocksInRequestFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                page: 1,
                ...e,
              };
            });
          }}
          onClearParams={onClearParams}
        />
        <StocksInRequestTable
          onChangePage={onChangePage}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          onRefresh={loadStocksInRequest}
        />
      </div>
    </React.Fragment>
  );
};

export default StocksInRequestPage;
