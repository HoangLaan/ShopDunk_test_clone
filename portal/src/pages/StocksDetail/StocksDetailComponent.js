import React, { useState, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';
import { getListProductImeiCodeStocks } from 'services/stocks-detail.service';

import FormSection from 'components/shared/FormSection';
//components
import TableDetail from './components/StocksDetailProduct/TableDetail';
import FilterDetail from './components/StocksDetailProduct/FilterDetail';

const StocksDetailComponent = () => {
  const { stocksId, productId } = useParams();
  const [params, setParams] = useState({
    stocks_id: stocksId,
    product_id: productId,
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

  const loadStocksDetailProduct = useCallback(() => {
    setLoading(true);
    getListProductImeiCodeStocks(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadStocksDetailProduct, [loadStocksDetailProduct]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <FilterDetail
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <TableDetail
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
          onRefresh={loadStocksDetailProduct}
        />
      </div>
    </React.Fragment>
  );
};

export default StocksDetailComponent;
