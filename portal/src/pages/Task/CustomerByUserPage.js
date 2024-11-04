import React, { useState, useCallback, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';

import CustomerFilter from './components/page/CustomerFilter';
import CustomerByUserTable from './components/page/CustomerByUserTable';
import { getCustomerListByUser } from 'services/task.service';
import { defaultPaging, defaultParams } from 'utils/helpers';
import { TYPE_PURCHASE } from './utils/const';

const CustomerByUserPage = () => {
  const [params, setParams] = useState({ ...defaultParams, type_purchase: TYPE_PURCHASE.ALL });
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadCustomer = useCallback(() => {
    setLoading(true);
    getCustomerListByUser({ ...params })
      .then(setDataList)
      .finally(() => setLoading(false));
  }, [params]);
  useEffect(loadCustomer, [loadCustomer]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <CustomerFilter
          params={params}
          metaCount={dataList.meta}
          onChange={(e) => {
            setParams((prev) => {
              if (isEmpty(e)) {
                return {
                  is_active: 1,
                  page: 1,
                  itemsPerPage: 25,
                };
              }
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <CustomerByUserTable
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
          onRefresh={loadCustomer}
        />
      </div>
    </React.Fragment>
  );
};

export default CustomerByUserPage;