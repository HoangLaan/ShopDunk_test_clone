import React, {useCallback, useEffect, useState} from 'react'
import {defaultPaging, defaultParams} from "utils/helpers";
import MaterialGroupTable from "../components/Table/MaterialGroupTable";
import MaterialGroupFilter from "../components/Filter/MaterialGroupFilter";
import {getListMaterialGroup} from "../../../services/material-group.service";


const MaterialGroupPage = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const {items, itemsPerPage, page, totalItems, totalPages} = dataList;

  const loadFunction = useCallback(() => {
    setLoading(true);
    getListMaterialGroup(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadFunction, [loadFunction]);

  const onChangePage = (page) => setParams((prev) => {
    return {...prev, page}
  });

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>'
        <MaterialGroupFilter
          onChange={(p) => setParams({...params, ...p})}/>
        <MaterialGroupTable
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

export default MaterialGroupPage;
