import React, { useState, useCallback, useEffect } from 'react';
// services
import { getListCareService } from './helpers/call-api';
// component
import CareServiceFilter from './Components/CareServiceFilter';
import CareServiceTable from './Components/CareServiceTable';


const CareServicePage = () => {
    const [params, setParams] = useState({
        page: 1,
        is_active: 2,
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

    const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

    const loadCareServiceList = useCallback(() => {
        setLoading(true);
        getListCareService(params)
            .then(setDataList)
            .finally(() => {
                setLoading(false);
            });
    }, [params]);
    useEffect(loadCareServiceList, [loadCareServiceList]);
    return (
        <React.Fragment>
            <div className='bw_main_wrapp'>
                <CareServiceFilter
                    onChange={(e) => {
                        setParams((prev) => {
                            return {
                                ...prev,
                                ...e,
                            };
                        });
                    }}
                />
                <CareServiceTable
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
                    onRefresh={loadCareServiceList}
                />
            </div>
        </React.Fragment>
    )
}


export default CareServicePage;
