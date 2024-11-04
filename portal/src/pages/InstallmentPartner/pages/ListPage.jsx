import React from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { getList } from 'services/installment-partner.service';
import { defaultPaging, defaultParams } from 'utils/helpers';

import Filter from '../components/Filter';
import Table from '../components/Table';

const InstallmentPartnerList = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
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
    <div class='bw_main_wrapp'>
      <Filter
        onChange={(e) => {
          setParams((prev) => {
            return {
              ...prev,
              ...e,
            };
          });
        }}
      />
      <Table
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
        onRefresh={getData}
      />
    </div>
  );
};

export default InstallmentPartnerList;
