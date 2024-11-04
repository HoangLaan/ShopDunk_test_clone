import React, { useState, useCallback, useEffect } from 'react';
// services
import { getListGroupService } from './helpers/call-api';
// component
import GroupServiceFilter from './Components/GroupServiceFilter';
import GroupServiceTable from './Components/GroupServiceTable';


const GroupServicePage = () => {
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

    const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

    const loadGroupServiceList = useCallback(() => {
        setLoading(true);
        getListGroupService(params)
            .then(setDataList)
            .finally(() => {
                setLoading(false);
            });
    }, [params]);
    useEffect(loadGroupServiceList, [loadGroupServiceList]);
    return (
        <React.Fragment>
            <div className='bw_main_wrapp'>
                <GroupServiceFilter
                    onChange={(e) => {
                        setParams((prev) => {
                            return {
                                ...prev,
                                ...e,
                            };
                        });
                    }}
                />
                <GroupServiceTable
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
                    onRefresh={loadGroupServiceList}
                />
            </div>
        </React.Fragment>
    )
}


export default GroupServicePage;
