import React, { useState, useCallback, useEffect } from 'react';
import WorkScheduleTypeFilter from './components/WorkScheduleTypeFilter';
import WorkScheduleTypeTable from './components/WorkScheduleTypeTable';
import { getListWorkScheduleType } from 'services/work-schedule-type.service';

const WorkScheduleTypePage = () => {
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

  const loadWorkScheduleType = useCallback(() => {
    setLoading(true);
    getListWorkScheduleType(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadWorkScheduleType, [loadWorkScheduleType]);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <WorkScheduleTypeFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <WorkScheduleTypeTable
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
          onRefresh={loadWorkScheduleType}
        />
      </div>
    </React.Fragment>
  );
};

export default WorkScheduleTypePage;
