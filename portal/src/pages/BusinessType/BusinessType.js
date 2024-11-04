import React, {useCallback, useEffect, useState} from 'react';
// service
import {getList} from 'services/business-type.service';

// components
import BusinessTypeFilter from './components/BusinessTypeFilter';
import BusinessTypeTable from "./components/BusinessTypeTable";
import {defaultPaging, defaultParams} from "../../utils/helpers";

export default function BusinessType() {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadFunction = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadFunction, [loadFunction]);


  const onChangePage = (page) => setParams((prev) => {
    return { ...prev, page }});

  return (
    <React.Fragment>
      <div className='bw_main_wrapp' style={{ paddingBottom: '20px' }}>
        <BusinessTypeFilter onChange={(p) => setParams({ ...params, ...p })}/>
        <BusinessTypeTable
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
}
