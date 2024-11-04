import React, { useState, useCallback, useEffect } from 'react';
import { isEmpty } from 'lodash';
import ExchangePointFilter from '../components/ExchangePointFilter';
import ExchangePointTable from '../components/ExchangePointTable';
import { getListExchangePoint } from 'services/exchange-point.service';

const ExchangePointPage = () => {
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

  const loadExchangePoint = useCallback(() => {
    setLoading(true);
    getListExchangePoint(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadExchangePoint, [loadExchangePoint]);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <ExchangePointFilter
          onChange={(e) => {
            if (isEmpty(e)) setParams({
              is_active: 1,
              page: 1,
              itemsPerPage: 25,
            })
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <ExchangePointTable
          loading={loading}
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
          onRefresh={loadExchangePoint}
        />
      </div>
    </React.Fragment>
  );
};

export default ExchangePointPage;
