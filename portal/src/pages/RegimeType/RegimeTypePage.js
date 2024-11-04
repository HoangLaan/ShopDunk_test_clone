import React, { useState, useCallback, useEffect } from 'react';

import { getRegimeTypeList } from 'services/regime-type.service';
import { defaultPaging, defaultParams } from 'utils/helpers';

import RegimeTypeTable from './components/main/RegimeTypeTable';
import RegimeTypeFilter from './components/main/RegimeTypeFilter';

const RegimeTypePage = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadRegimeType = useCallback(() => {
    setLoading(true);
    getRegimeTypeList(params)
      .then(setDataList)
      .catch((_) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadRegimeType, [loadRegimeType]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <RegimeTypeFilter
          onClear={() => {
            setParams(defaultParams);
          }}
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <RegimeTypeTable
          loading={loading}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          onRefresh={loadRegimeType}
        />
      </div>
    </React.Fragment>
  );
};

export default RegimeTypePage;
