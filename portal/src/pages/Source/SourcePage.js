import React, { useState, useCallback, useEffect } from 'react';

import SourceFilter from './components/SourceFilter';
import SourceTable from './components/SourceTable';
import { getListSource } from 'services/source.service';

const SourcePage = () => {
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

  const loadSource = useCallback(() => {
    setLoading(true);
    getListSource(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadSource, [loadSource]);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <SourceFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <SourceTable
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
          onRefresh={loadSource}
        />
      </div>
    </React.Fragment>
  );
};

export default SourcePage;
