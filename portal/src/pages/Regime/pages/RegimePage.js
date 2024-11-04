import React, {useState, useCallback, useEffect} from 'react'
import {defaultPaging, defaultParams} from "utils/helpers";
import FilterRegime from "../components/Filter/FilterRegime";
import RegimeTable from "../components/Table/RegimeTable";
import {getListRegime} from "services/regime.service";


const BudgetTypePage = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const {items, itemsPerPage, page, totalItems, totalPages} = dataList;

  const loadFunction = useCallback(() => {
    setLoading(true);
    getListRegime(params)
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
        <FilterRegime
          onChange={(p) => setParams({...params, ...p})}/>
        <RegimeTable
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

export default BudgetTypePage;
