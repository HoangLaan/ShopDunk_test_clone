import React, { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import queryString from 'query-string';

import PricesHistoryFilter from 'pages/Prices/components/table-history-prices/PricesHistoryFilter';
import PricesHistoryTable from 'pages/Prices/components/table-history-prices/PricesHistoryTable';
import { getListPriceProductHistory } from 'pages/Prices/helpers/call-api';

const PricesList = () => {
  const { productId, priceId } = useParams();
  const { product_type = 1 } = queryString.parse(window.location.search);

  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    is_active: 1,
  });
  const [dataPricesPage, setDataPricesPage] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataPricesPage;
  const loadPricesPage = useCallback(() => {
    if (priceId && productId) {
      setLoading(true);
      getListPriceProductHistory({ ...params, product_id: productId, price_id: priceId, product_type: product_type })
        .then(setDataPricesPage)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params, priceId, productId, product_type]);

  useEffect(() => {
    loadPricesPage();
    return () => {};
  }, [loadPricesPage]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <PricesHistoryFilter
          onChange={(p) => {
            setParams({
              ...params,
              ...p,
            });
          }}
        />
        <PricesHistoryTable
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
          loading={loading}
          totalItems={totalItems}
        />
      </div>
    </React.Fragment>
  );
};

export default PricesList;
