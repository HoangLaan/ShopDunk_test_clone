import React, {useState, useCallback, useEffect} from 'react'
import BudgetTypeTable from "./components/Table/BudgetTypeTable";
import FilterBudgetType from "./components/Filter/BudgetTypeFilter";
import {defaultPaging, defaultParams} from "../../utils/helpers";
import {getListBudgetType} from "../../services/budget-type.service";


const BudgetTypePage = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const {items, itemsPerPage, page, totalItems, totalPages} = dataList;

  const loadFunction = useCallback(() => {
    setLoading(true);
    getListBudgetType(params)
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
        <FilterBudgetType
          onChange={(p) => setParams({...params, ...p})}/>
        <BudgetTypeTable
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
