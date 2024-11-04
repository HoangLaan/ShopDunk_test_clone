import React, { useState, useCallback, useEffect } from 'react';

import CustomerCareTypeFilter from './components/CustomerCareTypeFilter';
import CustomerCareTypeTable from './components/CustomerCareTypeTable';
import { getListCustomerCareType } from 'services/customer-care-type.service';

const CustomerCareTypePage = () => {
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

  const loadCustomerCareType = useCallback(() => {
    setLoading(true);
    getListCustomerCareType(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadCustomerCareType, [loadCustomerCareType]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <CustomerCareTypeFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <CustomerCareTypeTable
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
          onRefresh={loadCustomerCareType}
        />
      </div>
    </React.Fragment>
  );
};

export default CustomerCareTypePage;
