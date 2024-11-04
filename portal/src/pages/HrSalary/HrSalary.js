import React, { useState, useCallback, useEffect } from 'react';

import HrSalaryTable from './components/main-page/HrSalaryTable';
import HrSalaryFilter from './components/main-page/HrSalaryFilter';
import { getListHrSalary } from 'services/hr-salary.service';

const HrSalary = () => {
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    is_active: 1,
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

  const loadHrSalary = useCallback(() => {
    setLoading(true);
    getListHrSalary(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadHrSalary, [loadHrSalary]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <HrSalaryFilter
          onClear={() => {
            setParams({
              is_active: 1,
              page: 1,
              itemsPerPage: 25,
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
        <HrSalaryTable
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
          onRefresh={loadHrSalary}
        />
      </div>
      {/* <ConfirmModal /> */}
    </React.Fragment>
  );
};

export default HrSalary;
