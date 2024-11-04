import React, { useState, useCallback, useEffect } from 'react';
// services
import { getList } from 'services/unit.service';
//components
import UnitTable from './components/UnitTable';
import UnitFilter from './components/UnitFilter';

const UnitPage = () => {
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

  const loadUnit = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadUnit, [loadUnit]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <UnitFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <UnitTable
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
          onRefresh={loadUnit}
        />
      </div>
    </React.Fragment>
  );
};

export default UnitPage;
