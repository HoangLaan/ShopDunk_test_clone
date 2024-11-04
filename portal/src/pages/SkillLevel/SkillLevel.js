import React, { useCallback, useEffect, useState } from 'react';
import SkillLevelFilter from './components/SkillLevelFilter';
import SkillLevelTable from './components/SkillLevelTable';

// service
import { getListSkillLevel } from './helpers/call-api';

// components

const SkillLevel = () => {
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    is_active: 1,
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

  const getData = useCallback(() => {
    setLoading(true);
    getListSkillLevel(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(getData, [getData]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <SkillLevelFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <SkillLevelTable
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

export default SkillLevel;
