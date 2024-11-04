import React, { useState, useCallback, useEffect } from 'react';

import { getListDepartment } from 'services/department.service';
import DepartmentFilter from 'pages/Department/components/DepartmentFilter';
import DepartmentTable from 'pages/Department/components/DepartmentTable';
import { defaultPaging, defaultParams } from 'utils/helpers';

const DepartmentPage = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadDeparment = useCallback(() => {
    setLoading(true);
    getListDepartment(params)
      .then(setDataList)
      .catch((_) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadDeparment, [loadDeparment]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <DepartmentFilter
          onChange={(e) => {
            if (e) {
              setParams((prev) => {
                return {
                  ...prev,
                  ...e,
                };
              });
            } else {
              setParams(defaultPaging);
            }
          }}
        />
        <DepartmentTable
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
          onRefresh={loadDeparment}
        />
      </div>
    </React.Fragment>
  );
};

export default DepartmentPage;
