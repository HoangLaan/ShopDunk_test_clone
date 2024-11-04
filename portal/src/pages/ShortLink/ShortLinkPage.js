import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { getList} from 'services/short-link.service';
import ShortLinkFilter from "./components/ShortLinkFilter";
import ShortLinkTable from "./components/ShortLinkTable";
import { defaultPaging, defaultParams } from "utils/helpers";

const ShortLinkPage = () => {
    const [params, setParams] = useState(defaultParams);
    const [dataList, setDataList] = useState(defaultPaging);
    const [loading, setLoading] = useState(true);
    const onClearParams = () => setParams(defaultParams);
    const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));
  
    const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

    
  const loadData = useCallback(() => {
    setLoading(true);
      getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadData, [loadData]);

  const onChangePage = (page) =>
    setParams((prev) => {
      return { ...prev, page };
    });

    return (
        <div className='bw_main_wrapp'>
          <ShortLinkFilter onChange={onChange} onClearParams={onClearParams}/>
          <ShortLinkTable
            data={items}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            page={page}
            totalItems={totalItems}
            loading={loading}
            onRefresh={loadData}
            onChangePage={onChangePage}
          />
        </div>
      );
}

export default ShortLinkPage