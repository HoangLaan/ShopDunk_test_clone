import React from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';

import Filter from './components/Filters';
import Table from './components/Tables';
import zaloTemplateService from 'services/zaloTemplate.service';

import { defaultPaging, defaultParams } from 'utils/helpers';

const ZaloHistory = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const { data, itemsPerPage, page, totalItems, totalPages } = dataList;

  const getData = useCallback(() => {
    setLoading(true);
    zaloTemplateService.getListHistory(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(getData, [getData]);

  const onFilter = (e) => {
    setParams((prev) => {
      return {
        ...prev,
        ...e,
      };
    });
  };

  return (
    <>
      <div class='bw_main_wrapp'>
        <Filter onChange={onFilter} />

        <Table
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          data={data}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          onRefresh={getData}
        />
      </div>
    </>
  );
};

export default ZaloHistory;
