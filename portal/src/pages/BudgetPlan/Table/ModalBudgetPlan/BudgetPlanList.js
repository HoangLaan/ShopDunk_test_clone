import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from 'context/AuthProvider';
import BudgetPlanListFilter from './BudgetPlanListFilter';
import BudgetPlanListTable from './BudgetPlanListTable';
import { getListBudgetPlanList } from 'pages/BudgetPlan/helper/call-api';

const BudgetPlanList = ({ setIsOpenBudgetPlanList, isOpenBudgetPlanList, companyOpts, onReLoad }) => {
    const { user } = useAuth();
    const [params, setParams] = useState({
        page: 1,
        itemsPerPage: 25,
        is_active: 1,
        company_id: user?.isAdministrator === 1 ? null : user?.company_id,
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
        getListBudgetPlanList(params)
            .then(setDataList)
            .finally(() => {
                setLoading(false);
            });
    }, [params]);
    useEffect(getData, [getData]);

    return (
        <div className='bw_modal bw_modal_open' id='bw_add_budget_plan'>
            <div className='bw_modal_container bw_w1200 '>
                <div className='bw_title_modal'>
                    <h3>Danh sách kế hoạch ngân sách</h3>
                    <span
                        className='fi fi-rr-cross-small bw_close_modal'
                        onClick={() => setIsOpenBudgetPlanList(!isOpenBudgetPlanList)}
                    />
                </div>
                <div className='bw_main_wrapp'>
                    <BudgetPlanListFilter
                        onChange={(e) => {
                            setParams((prev) => {
                                return {
                                    ...prev,
                                    ...e,
                                };
                            });
                        }}
                        companyOpts={companyOpts}
                    />
                    <BudgetPlanListTable
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
                        onRefresh={getData}
                        onReLoad={onReLoad}
                    />
                </div>
            </div>
        </div>
    )
}

export default BudgetPlanList