import React, { useState, useCallback, useEffect } from 'react';
// services
import { getListHoliday } from './helpers/call-api';
// component
import HolidayFilter from './Components/HolidayFilter';
import HolidayTable from './Components/HolidayTable';


const HolidayPage = () => {
    const [params, setParams] = useState({
        page: 1,
        is_active: 1,
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

    const loadHolidayList = useCallback(() => {
        setLoading(true);
        getListHoliday(params)
            .then(setDataList)
            .finally(() => {
                setLoading(false);
            });
    }, [params]);
    useEffect(loadHolidayList, [loadHolidayList]);
    return (
        <React.Fragment>
            <div className='bw_main_wrapp'>
                <HolidayFilter
                    onChange={(e) => {
                        setParams((prev) => {
                            return {
                                ...prev,
                                ...e,
                            };
                        });
                    }}
                />
                <HolidayTable
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
                    onRefresh={loadHolidayList}
                />
            </div>
        </React.Fragment>
    )
}


export default HolidayPage;
