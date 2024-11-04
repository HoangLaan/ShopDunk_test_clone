import React, { useState, useCallback, useEffect } from 'react';

import EquipmentGroupFilter from './components/EquipmentGroupFilter';
import EquipmentGroupTable from './components/EquipmentGroupTable';
import { getListEquipmentGroup } from 'services/equipment-group.service';
import { defaultParams } from 'utils/helpers';
import { defaultPaging } from 'utils/helpers';

const EquipmentGroupPage = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadEquipmentGroup = useCallback(() => {
    setLoading(true);
    getListEquipmentGroup(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadEquipmentGroup, [loadEquipmentGroup]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <EquipmentGroupFilter
          onChange={(e) => {
            setParams(e);
          }}
        />
        <EquipmentGroupTable
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
          onRefresh={loadEquipmentGroup}
        />
      </div>
    </React.Fragment>
  );
};

export default EquipmentGroupPage;
