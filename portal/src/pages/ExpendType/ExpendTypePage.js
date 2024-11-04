import React, { useState, useCallback, useEffect } from 'react';

import { getExpendTypeList } from 'services/expend-type.service';
import ExpendTypeTable from './components/main/ExpendTypeTable';
import ExpendTypeFilter from './components/main/ExpendTypeFilter';

const ExpendTypePage = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 10,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadExpendType = useCallback(() => {
    setLoading(true);
    getExpendTypeList(params)
      .then(setDataList)
      .catch((_) => { })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadExpendType, [loadExpendType]);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <ExpendTypeFilter
          onClear={() => {
            setParams({
              is_active: 1,
              page: 1,
              itemsPerPage: 10,
            });
          }}
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <ExpendTypeTable
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
          onRefresh={loadExpendType}
          params={params}
        />
      </div>
    </React.Fragment>
  );
};

export default ExpendTypePage;
