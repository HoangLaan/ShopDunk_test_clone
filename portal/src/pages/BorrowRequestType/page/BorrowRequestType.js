import React, {useState, useCallback, useEffect} from 'react'
import BorrowRequestTable from "../components/Table/BorrowRequestTable";
import FilterBorrowType from "../components/Filter/BorrowRequestFilter";
import {defaultPaging, defaultParams} from "utils/helpers";
import {getListBorrowType} from "services/borrow-type.service";


const BorrowTypePage = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const {items, itemsPerPage, page, totalItems, totalPages} = dataList;

  const loadFunction = useCallback(() => {
    setLoading(true);
    getListBorrowType(params)
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
        <FilterBorrowType
          onChange={(p) => setParams({...params, ...p})}/>
        <BorrowRequestTable
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

export default BorrowTypePage;
