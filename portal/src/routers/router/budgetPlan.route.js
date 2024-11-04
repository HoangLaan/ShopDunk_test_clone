import React from 'react';

const BudgetPlanAddPage = React.lazy(() => import('pages/BudgetPlan/BudgetPlanAdd'));
const BudgetPlanCopyPage = React.lazy(() => import('pages/BudgetPlan/BudgetPlanCopy'));
const BudgetPlanTransfer = React.lazy(() => import('pages/BudgetPlan/BudgetPlanTransfer'));
const BudgetPlan = React.lazy(() => import('pages/BudgetPlan/Table/BudgetPlan'));


const budgetPlanRoutes = [
  {
    path: '/budget-plan/add',
    exact: true,
    name: 'Tạo lập kế hoạch ngân sách',
    function: 'FI_BUDGETPLAN_ADD',
    component: BudgetPlanAddPage,
  },
  {
    path: '/budget-plan/copy/:id',
    exact: true,
    name: 'Sao chép',
    function: 'FI_BUDGET_PLAN_VIEW',
    component: BudgetPlanCopyPage,
  },
  {
    path: '/budget-plan/transfer/:id',
    exact: true,
    name: 'Chuyển phân bố ngân sách',
    function: 'FI_BUDGET_PLAN_ADD',
    component: BudgetPlanTransfer,
  },
  {
    path: '/budget-plan',
    exact: true,
    name: 'Danh sách kế hoạch ngân sách',
    function: 'FI_BUDGETPLAN_VIEW',
    component: BudgetPlan,
  },
  {
    path: '/budget-plan/edit/:id',
    exact: true,
    name: 'Chỉnh sửa kế hoạch ngân sách',
    function: 'FI_BUDGETPLAN_EDIT',
    component: BudgetPlanAddPage,
  }
];

export default budgetPlanRoutes;
