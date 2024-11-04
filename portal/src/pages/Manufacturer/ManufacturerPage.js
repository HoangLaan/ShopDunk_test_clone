import React, { useState, useCallback, useEffect } from 'react';

import { getListManufacturer } from 'services/manufacturer.service';
import ManufacturerTable from './components/ManufacturerTable';
import ManufacturerFilter from './components/ManufacturerFilter';

const ManufacturerPage = () => {
  const [loading, setLoading] = useState(false);
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

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadManufacturer = useCallback(() => {
    setLoading(true);
    getListManufacturer(params)
      .then(setDataList)
      .catch((_) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadManufacturer, [loadManufacturer]);

  return (
    <React.Fragment>
      <div class='bw_main_wrapp'>
        <ManufacturerFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <ManufacturerTable
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
          onRefresh={loadManufacturer}
        />
      </div>
    </React.Fragment>
  );
};

export default ManufacturerPage;
