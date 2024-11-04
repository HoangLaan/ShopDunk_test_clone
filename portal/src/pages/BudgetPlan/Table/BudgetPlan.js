import React, { useState, useCallback, useEffect } from 'react'
import { getListBudgetPlan, getListBudgetPlanOpts, getListCompanyOpts } from '../helper/call-api';
import BudgetPlanFilter from './BudgetPlanFilter';
import BudgetPlanTable from './BudgetPlanTable';
import { useAuth } from 'context/AuthProvider';
import { FormProvider, useForm } from 'react-hook-form';
import { mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
const BudgetPlan = () => {
    const methods = useForm();
    const { user } = useAuth()
    const [companyOpts, setCompanyOpts] = useState([])
    const [budgetPlanOpts, setBudgetPlanOpts] = useState([])

    const [params, setParams] = useState({
        page: 1,
        itemsPerPage: 25,
        is_active: 1,
        company_id: user.isAdministrator === 1 ? null : user.company_id,
        year: (new Date()).getFullYear(),
    });

    const [dataList, setDataList] = useState({
        items: [],
        itemsPerPage: 0,
        page: 0,
        totalItems: 0,
        totalPages: 0,
    });

    const [loading, setLoading] = useState(true);
    const { itemsPerPage, page, totalItems, totalPages, totalNotYetReview } = dataList;

    const getData = useCallback(() => {
        if (params.budget_plan_id) {
            setLoading(true);
            getListBudgetPlan(params)
                .then((data) => {
                    setDataList(data)
                    methods.reset({
                        data: data.items
                    })
                }
                )
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [params]);
    useEffect(getData, [getData]);

    const initData = async () => {
        try {
            let companyOpts = await getListCompanyOpts()
            setCompanyOpts(mapDataOptions4SelectCustom(companyOpts))

            let budgetPlanOpts = await getListBudgetPlanOpts()
            setBudgetPlanOpts(mapDataOptions4SelectCustom(budgetPlanOpts))
            setParams({
                ...params,
                budget_plan_id: budgetPlanOpts[0].id
            })
        } catch (error) {
            showToast.error(error.message);
        }
    }

    useEffect(() => {
        initData()
    }, [])

    return (
        <React.Fragment>
            <div class='bw_main_wrapp'>
                <BudgetPlanFilter
                    onChange={(e) => {
                        setParams((prev) => {
                            return {
                                ...prev,
                                ...e,
                            };
                        });
                    }}
                    companyOpts={companyOpts}
                    budgetPlanOpts={budgetPlanOpts}
                />
                <FormProvider {...methods}>
                    <BudgetPlanTable
                        onChangePage={(page) => {
                            setParams({
                                ...params,
                                page,
                            });
                        }}
                        data={methods.watch('data')}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        page={page}
                        totalItems={totalItems}
                        loading={loading}
                        onRefresh={getData}
                        companyOpts={companyOpts}
                        methods={methods}
                        totalNotYetReview={totalNotYetReview}
                    />
                </FormProvider>

            </div>
        </React.Fragment>
    )
}

export default BudgetPlan