import httpClient from 'utils/httpClient';

export const getListBudgetPlan = (params) => {
    return httpClient.get('/budget-plan', { params });
};

export const deleteBudgetPlanApi = (params) => {
    let ids;
    if (Array.isArray(params)) {
        ids = (params || []).map((x) => x.budget_plan_distribution_id).join(',');
    } else {
        ids = `${params}`;
    }
    return httpClient.delete(`/budget-plan`, { data: { ids } });
};

export const getOptionsTreeView = (params) => {
    return httpClient.get('/budget-plan/get-options-tree-view', { params });
};

export const updateBudgetPlanDetail = (params) => {
    return httpClient.put(`/budget-plan/detail`, params);
};

export const getListCompanyOpts = (params) => {
    return httpClient.get('/budget-plan/company/options', { params });
};

export const getListBudgetPlanOpts = (params) => {
    return httpClient.get('/budget-plan/options', { params });
};

export const getListDepartment = (params) => {
    return httpClient.get('/budget-plan/department/options', { params });
};

export const getListBudgetPlanList = (params) => {
    return httpClient.get('/budget-plan/list', { params });
};

export const updateReview = (params) => {
    return httpClient.put('/budget-plan/review', params);
};

export const deleteBudgetPlanList = (params) => {
    let ids;
    if (Array.isArray(params)) {
        ids = (params || []).map((x) => x.budget_plan_id).join(',');
    } else {
        ids = `${params}`;
    }
    return httpClient.delete('/budget-plan/list', { data: { ids } });
};

export const updateBudgetDistriBution = (params) => {
    return httpClient.put('/budget-plan/budget-plan-distribution-detail', params);
};

export const getListBudgetOpts = (params) => {
    return httpClient.get('/budget-plan/budget/options', { params });
};

export const getOldTotalBudgetPlan = (params) => {
    return httpClient.get(`/budget-plan/total`, { params });
}

export const getDetail = (id) => {
    return httpClient.get(`/budget-plan/detail/${id}`);
};

export const createBudgetPlan = (params) => {
    return httpClient.post(`/budget-plan`, params);
};

export const updateBudgetPlan = (id, params) => {
    return httpClient.put(`/budget-plan/${id}`, params);
};
