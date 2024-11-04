import React, { useState, useCallback, useEffect } from 'react';

import { getListSupplier } from 'services/supplier.service';
import SupplierTable from './components/main/SupplierTable';
import SupplierFilter from './components/main/SupplierFilter';
import { defaultParams } from 'utils/helpers';

const SupplierPage = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadSupplier = useCallback(() => {
    setLoading(true);
    getListSupplier(params)
      .then(setDataList)
      .catch((_) => { })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadSupplier, [loadSupplier]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <SupplierFilter
          onClearParams={() => setParams(defaultParams)}
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <SupplierTable
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
          onRefresh={loadSupplier}
        />
      </div>
    </React.Fragment>
  );
};

export default SupplierPage;