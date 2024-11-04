import React from 'react';

const BudgetType = React.lazy(() => import('pages/BudgetType/BudgetType'));
const BudgetTypeAdd = React.lazy(() => import('pages/BudgetType/BudgetTypeAdd'));
const BudgetTypeEdit = React.lazy(() => import('pages/BudgetType/BudgetTypeEdit'));
const BudgetTypeDetail = React.lazy(() => import('pages/BudgetType/BudgetTypeDetail'));

const BudgetTypeRoutes = [
  {
    path: '/budget-type',
    exact: true,
    name: 'Danh sách loại ngân sách',
    function: 'FI_BUDGETTYPE_VIEW',
    component: BudgetType,
  },
  {
    path: '/budget-type/add',
    exact: true,
    name: 'Thêm mới loại ngân sách',
    function: 'FI_BUDGETTYPE_ADD',
    component: BudgetTypeAdd,
  },
  {
    path: '/budget-type/edit/:id',
    exact: true,
    name: 'Chỉnh sửa loại ngân sách',
    function: 'FI_BUDGETTYPE_EDIT',
    component: BudgetTypeEdit,
  },
  {
    path: '/budget-type/detail/:id',
    exact: true,
    name: 'Chi tiết loại ngân sách',
    function: 'FI_BUDGETTYPE_VIEW',
    component: BudgetTypeDetail,
  },
];
export default BudgetTypeRoutes;
