import React, { useCallback, useEffect, useState } from 'react';
import { defaultPaging, defaultParams } from '../../utils/helpers';
import { getList } from 'services/stocks-type.service';
import StocksTypeFilter from './components/StocksTypeFilter';
import StocksTypeTable from './components/StocksTypeTable';

export default function StocksType() {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadFunction = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadFunction, [loadFunction]);

  const onChangePage = (page) =>
    setParams((prev) => {
      return { ...prev, page };
    });

  return (
    <React.Fragment>
      <div className='bw_main_wrapp' style={{ paddingBottom: '20px' }}>
        <StocksTypeFilter handleSubmitFilter={(p) => setParams({ ...params, ...p })} />
        <StocksTypeTable
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          onRefresh={loadFunction}
          onChangePage={onChangePage}
        />
      </div>
    </React.Fragment>
  );
}
