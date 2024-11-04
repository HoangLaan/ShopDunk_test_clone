import React from 'react';

const RequestUsingBudgetAddPage = React.lazy(() => import('pages/RequestUsingBudget/RequestUsingBudgetAddPage'));
const RequestUsingBudgetPage = React.lazy(() => import('pages/RequestUsingBudget/RequestUsingBudgetPage'));

const requestUsingBudget = [
  {
    path: '/request-using-budget',
    exact: true,
    name: 'Danh sách đề nghị sử dụng ngân sách',
    function: 'FI_RQ_USINGBUDGET_VIEW',
    component: RequestUsingBudgetPage,
  },
  {
    path: '/request-using-budget/add',
    exact: true,
    name: 'Thêm mới đề nghị sử dụng ngân sách',
    function: 'FI_RQ_USINGBUDGET_ADD',
    component: RequestUsingBudgetAddPage,
  },
  {
    path: '/request-using-budget/copy/:request_using_budget_id',
    exact: true,
    name: 'Sao chép đề nghị sử dụng ngân sách',
    function: 'FI_RQ_USINGBUDGET_COPY',
    component: RequestUsingBudgetAddPage,
  },
  {
    path: '/request-using-budget/review/:request_using_budget_id',
    exact: true,
    name: 'Duyệt đề nghị sử dụng ngân sách',
    function: 'FI_RQ_USINGBUDGET_REVIEW',
    component: RequestUsingBudgetAddPage,
  },
  {
    path: '/request-using-budget/edit/:request_using_budget_id',
    exact: true,
    name: 'Chỉnh sửa đề nghị sử dụng ngân sách',
    function: 'FI_RQ_USINGBUDGET_EDIT',
    component: RequestUsingBudgetAddPage,
  },
  {
    path: '/request-using-budget/detail/:request_using_budget_id',
    exact: true,
    name: 'Chi tiết đề nghị sử dụng ngân sách',
    function: 'FI_RQ_USINGBUDGET_VIEW',
    component: RequestUsingBudgetAddPage,
  },
];

export default requestUsingBudget;
