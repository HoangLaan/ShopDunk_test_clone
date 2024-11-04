import React, { useCallback, useState, useEffect } from 'react';
import { getListCommission } from 'services/commission.service';
import TableCommission from '../components/Tables/TableCommission';
import FilterCommission from '../components/Filters/FilterCommission';

function Commission() {
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
  });
  const [dataCommission, setDataCommission] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const { items, itemsPerPage, page, totalItems, totalPages } = dataCommission;

  const [loading, setLoading] = useState(false);

  const loadCommission = useCallback(() => {
    setLoading(true);
    getListCommission(params)
      .then(setDataCommission)
      .finally(() => setLoading(false));
  }, [params]);
  useEffect(loadCommission, [loadCommission]);

  return (
    <div className='bw_main_wrapp'>
      <FilterCommission onChange={(p) => setParams({ ...params, ...p })} />
      <TableCommission
        loading={loading}
        onChangePage={(page) => setParams({ ...params, page, })}
        data={items}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onRefresh={loadCommission}
      />
    </div>
  );
}

export default Commission;
