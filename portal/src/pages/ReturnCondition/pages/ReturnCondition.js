import React, { useCallback, useEffect, useState } from 'react';
import FilterReturnCondition from '../components/Filter/FilterReturnCondition';
import TableReturnCondition from '../components/Table/TableReturnCondition';
import returnConditionService from 'services/return-condition.service';
import { defaultParams } from '../../../utils/helpers';
import { defaultPaging } from '../../../utils/helpers';

function ReturnCondition() {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadFunction = useCallback(() => {
    setLoading(true);
    returnConditionService
      .getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  console.log(dataList);

  useEffect(loadFunction, [loadFunction]);

  const onChangePage = (page) =>
    setParams((prev) => {
      return { ...prev, page };
    });

  return (
    <div className='bw_main_wrapp'>
      <FilterReturnCondition onChange={(p) => setParams({ ...params, ...p })} />
      <TableReturnCondition
        data={items}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        loading={loading}
        onRefresh={loadFunction}
        onChangePage={onChangePage}
      />
    </div>
  );
}

export default ReturnCondition;
