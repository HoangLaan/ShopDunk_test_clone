import React, { useState, useCallback, useEffect } from 'react';
import BorrowRequestTable from '../components/Table/BorrowRequestTable';
import FilterBorrowRequest from '../components/Filter/BorrowRequestFilter';
import { defaultPaging, defaultParams } from 'utils/helpers';
import borrowRequestService from 'services/borrow-request.service';

const BorrowRequestPage = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadFunction = useCallback(() => {
    setLoading(true);
    borrowRequestService
      .getListBorrowRequest(params)
      .then((data) => {
        setDataList(data);
      })
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
        <FilterBorrowRequest onChange={(p) => setParams({ ...params, ...p })} />
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

export default BorrowRequestPage;
