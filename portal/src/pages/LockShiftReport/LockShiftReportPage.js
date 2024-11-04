import React, { useState, useCallback, useEffect } from 'react';
import { showToast } from 'utils/helpers';

import { getLockShiftReportList } from 'services/lock-shift-report.service';
import { defaultPaging, defaultParams } from 'utils/helpers';

import LockShiftReportFilter from './components/LockShiftReportFilter';
import LockShiftReportTable from './components/LockShiftReportTable';

const LockShiftReportPage = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadData = useCallback(() => {
    setLoading(true);
    let query = params;

    query.store_id = query.store_id?.value ?? undefined;
    query.shift_leader = query.shift_leader?.value ?? undefined;

    getLockShiftReportList(query)
      .then(setDataList)
      .catch((err) => {
        showToast.error(err?.message ?? 'Có lỗi xảy ra', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadData, [loadData]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <LockShiftReportFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />

        <LockShiftReportTable
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
          onRefresh={loadData}
        />
      </div>
    </React.Fragment>
  );
};

export default LockShiftReportPage;
