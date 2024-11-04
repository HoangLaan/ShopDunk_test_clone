import React, { useEffect, useCallback, useState } from 'react';

import CostTypeFilter from '../components/CostTypeFilter';
import CostTypeTable from '../components/CostTypeTable';

import { defaultPaging, defaultParams } from '../../../utils/helpers';

import { getListCostType } from '../helpers/call-api';

const CostType = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);

  const [loading, setLoading] = useState(true);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const getData = useCallback(() => {
    setLoading(true);
    getListCostType({ ...params })
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(getData, [getData]);

  return (
    <React.Fragment>
      <div class='bw_main_wrapp'>
        <CostTypeFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />

        <CostTypeTable
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
    </React.Fragment>
  );
};

export default CostType;
