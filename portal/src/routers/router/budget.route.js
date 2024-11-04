import React from 'react';

const Budget = React.lazy(() => import('pages/Budget/pages/DefaultPage'));
const BudgetAdd = React.lazy(() => import('pages/Budget/pages/AddPage'));
const BudgetEdit = React.lazy(() => import('pages/Budget/pages/EditPage'));
const BudgetDetail = React.lazy(() => import('pages/Budget/pages/DetailPage'));

const budget = [
  {
    path: '/budget',
    exact: true,
    name: 'Danh sách ngân sách',
    function: 'FI_BUDGET_VIEW',
    component: Budget,
  },
  {
    path: '/budget/add',
    exact: true,
    name: 'Thêm mới ngân sách',
    function: 'FI_BUDGET_ADD',
    component: BudgetAdd,
  },
  {
    path: '/budget/edit/:id',
    exact: true,
    name: 'Chỉnh sửa ngân sách',
    function: 'FI_BUDGET_EDIT',
    component: BudgetEdit,
  },
  {
    path: '/budget/detail/:id',
    exact: true,
    name: 'Chi tiết ngân sách',
    function: 'FI_BUDGET_VIEW',
    component: BudgetDetail,
  },
];

export default budget;
