import React, { useCallback, useState, useEffect } from 'react';

import { getList, checkUserHaveShift } from 'services/lockshift-close.service';
import { defaultPaging, defaultParams, showToast } from 'utils/helpers';

import LockshiftTable from '../components/LockshiftTable';
import LockshiftFilter from '../components/LockshiftFilter';

const DefaultLockshiftClosePage = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataItem, setDataItem] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const [isEndShift, setIsEndShift] = useState(false);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataItem;

  const loadLockshifts = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataItem)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(() => {
    loadLockshifts();
  }, [loadLockshifts]);

  useEffect(() => {
    (async ()=>{
      try{
      const res = await checkUserHaveShift();
        if(res?.isValidShift){
          showToast.warning('Ca đã được kết')
        }
        setIsEndShift(true); 
      } catch (error) {
        console.error('Error:', error);
      }    
      })()
    },[])


  const onChange = (params) => {
    setParams((prev) => ({ ...prev, ...params }));
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <LockshiftFilter onChange={onChange} />
        <LockshiftTable
          onChangePage={(page) => {
            onChange({ page });
          }}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          isEndShift={isEndShift}
        />
      </div>
    </React.Fragment>
  );
};

export default DefaultLockshiftClosePage;
