import React, { useState, useCallback, useEffect } from 'react';
import { isEmpty } from 'lodash';
import CumulatePointTypeFilter from '../components/CumulatePointTypeFilter';
import CumulatePointTypeTable from '../components/CumulatePointTypeTable';
import { getListCumulatePointType } from 'services/cumulate-point-type.service';

const CumulatePointTypePage = () => {
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

  const loadCumulatePointType = useCallback(() => {
    setLoading(true);
    getListCumulatePointType(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadCumulatePointType, [loadCumulatePointType]);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <CumulatePointTypeFilter
          onChange={(e) => {
            if (isEmpty(e)) setParams({
              is_active: 1,
              page: 1,
              itemsPerPage: 25,
            })
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <CumulatePointTypeTable
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
          onRefresh={loadCumulatePointType}
        />
      </div>
    </React.Fragment>
  );
};

export default CumulatePointTypePage;
