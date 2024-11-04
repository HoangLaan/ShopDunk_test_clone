import React, { useState, useCallback, useEffect } from 'react';

import PayPartnerFilter from './components/PayPartnerFilter';
import PayPartnerTable from './components/PayPartnerTable';
import { getListPayPartner } from 'services/pay-partner.service';

const PayPartnerPage = () => {
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

  const loadPayPartner = useCallback(() => {
    setLoading(true);
    getListPayPartner(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadPayPartner, [loadPayPartner]);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <PayPartnerFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <PayPartnerTable
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
          onRefresh={loadPayPartner}
        />
      </div>
    </React.Fragment>
  );
};

export default PayPartnerPage;
