import React, { useCallback, useEffect, useState } from 'react';
import FilterExperience from '../components/Filter/FilterExperience';
import TableExperience from '../components/Table/TableExperience';
import experienceService from 'services/experience.service';
import { defaultParams } from '../../../utils/helpers';
import { defaultPaging } from '../../../utils/helpers';

function Experience() {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const onClearParams = () => setParams(defaultParams);
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadFunction = useCallback(() => {
    setLoading(true);
    experienceService
      .getList(params)
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
    <div className='bw_main_wrapp'>
      <FilterExperience onChange={onChange} onClearParams={onClearParams} />
      <TableExperience
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

export default Experience;
