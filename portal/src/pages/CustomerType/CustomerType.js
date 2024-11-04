import React, { useEffect, useState, useCallback } from 'react';

// common
// service
import { getList } from 'services/customer-type.service';

// components
import CustomerTypeFilter from './components/CustomerTypeFilter';
import { useAuth } from 'context/AuthProvider';
import CustomerTypeTable from './components/CustomerTypeTable';

export default function CustomerType() {
  const { user } = useAuth();

  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    is_active: 1,
    company_id: user?.isAdministrator === 1 ? null : user?.company_id,
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

  const getData = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(getData, [getData]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <CustomerTypeFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <CustomerTypeTable
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
          onRefresh={getData}
        />
      </div>
    </React.Fragment>
  );
}
