import React, { useState, useCallback, useEffect } from 'react';
import { defaultPaging, defaultParams } from 'utils/helpers';
import FilterWorkSchedule from '../components/Filter';
import WorkScheduleTable from '../components/Table';
import { getListWorkSchedule } from 'services/work-schedule.service';

const WorkSchedulePage = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadFunction = useCallback(() => {
    setLoading(true);
    getListWorkSchedule(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadFunction, [loadFunction]);

  const onChangePage = (page) =>
    setParams((prev) => {
      return { ...prev, page };
    });

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <FilterWorkSchedule onChange={(p) => setParams({ ...p })} />
        <WorkScheduleTable
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
    </React.Fragment>
  );
};

export default WorkSchedulePage;