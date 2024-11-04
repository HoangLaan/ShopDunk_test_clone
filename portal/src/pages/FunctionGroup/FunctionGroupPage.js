import React, { useState, useCallback, useEffect } from 'react';
import { defaultPaging, defaultParams } from 'utils/helpers';

import FuntionGroupFilter from './components/FuntionGroupFilter';
import FunctionGroupTable from './components/FunctionGroupTable';
import { getListFunctionGroup } from 'services/function-group.service';

const FunctionGroupPage = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const onClearParams = () => setParams(defaultParams);

  const [loading, setLoading] = useState(true);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadFunctionGroup = useCallback(() => {
    setLoading(true);
    getListFunctionGroup(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadFunctionGroup, [loadFunctionGroup]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <FuntionGroupFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
          onClearParams={onClearParams}
        />
        <FunctionGroupTable
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
          onRefresh={loadFunctionGroup}
        />
      </div>
    </React.Fragment>
  );
};

export default FunctionGroupPage;
