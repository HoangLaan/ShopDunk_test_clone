import React, { useState, useCallback, useEffect } from 'react';

// Service
import { getListDebit } from './helpers/call-api';

// component
import DebitFilter from './Components/DebitFilter';
import DebitTable from './Components/DebitTable';
import DebitSummary from './Components/DebitSummary';

const DebitPage = () => {
  const [params, setParams] = useState({
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
  const { items, itemsPerPage, page, totalItems, totalPages, statistic = {} } = dataList;
  const loadListDebit = useCallback(() => {
    setLoading(true);
    getListDebit(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadListDebit, [loadListDebit]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <DebitFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <div className='bw_box_card bw_mt_2'>
          <DebitSummary statistic={statistic} />
          <DebitTable
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
            onRefresh={loadListDebit}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default DebitPage;
