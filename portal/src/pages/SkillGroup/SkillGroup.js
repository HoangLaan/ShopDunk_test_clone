import React, { useCallback, useEffect, useState } from 'react';
import SkillGroupFilter from './components/SkillGroupFilter';
import SkillGroupTable from './components/SkillGroupTable';
import { defaultParams } from '../../utils/helpers';
// service
import { getListSkillGroup } from './helpers/call-api';

// components

const SkillGroup = () => {
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
  const onClearParams = () => setParams(defaultParams);
  const getData = useCallback(() => {
    setLoading(true);
    getListSkillGroup(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(getData, [getData]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <SkillGroupFilter
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
        <SkillGroupTable
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

export default SkillGroup;
