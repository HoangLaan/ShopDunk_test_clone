import React, { useState, useCallback, useEffect } from 'react';

import CustomerFilter from './components/page/CustomerFilter';
import CustomerTable from './components/page/CustomerTable';
import { getCustomerList } from 'services/task.service';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { defaultPaging, defaultParams } from 'utils/helpers';
import { TYPE_PURCHASE } from './utils/const';

const CustomerPage = () => {
  const [params, setParams] = useState({ ...defaultParams, type_purchase: TYPE_PURCHASE.ALL });
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;
  const { task_id } = useParams();

  const loadCustomer = useCallback(() => {
    setLoading(true);
    getCustomerList({ ...params, task_id })
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params, task_id]);
  useEffect(loadCustomer, [loadCustomer]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <CustomerFilter
          params={{ ...params, task_id }}
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
        <CustomerTable
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

export default CustomerPage;
