import React, { useCallback, useEffect, useState } from 'react'
import NewsFilter from './components/NewsFilter';
import NewsTable from './components/NewsTable';
import { getListNews } from './helpers/call-api';
import CustomerCareService from 'services/customer-care.service';

const StaticContent = () => {
    const [params, setParams] = useState({
        page: 1,
        itemsPerPage: 25,
        //is_active: 1
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

    const getData = useCallback(() => {
        setLoading(true);
        getListNews(params)
            .then(setDataList)
            .finally(() => {
                setLoading(false);
            });
    }, [params]);
    useEffect(getData, [getData]);

    const exportExcel = () => {
        CustomerCareService.exportExcelS(params)
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response?.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'static-content.xlsx');
            document.body.appendChild(link);
            link.click();
          })
          .catch(() => {});
      };

    return (
        <React.Fragment>
            <div class='bw_main_wrapp'>
                <NewsFilter
                    onChange={(e) => {
                        setParams((prev) => {
                            return {
                                ...prev,
                                ...e,
                            };
                        });
                    }}
                />
                <NewsTable
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
                    onRefresh={getData}
                    exportExcel={exportExcel}
                />
            </div>
        </React.Fragment>
    )
}

export default StaticContent