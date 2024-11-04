import React from 'react';

const CashFlowPage = React.lazy(() => import('pages/CashFlow/CashFlowPage'));
const CashFlowAddPage = React.lazy(() => import('pages/CashFlow/CashFlowAddPage'));

const cashFlowRoute = [
  {
    path: '/cash-flow',
    exact: true,
    name: 'Danh sách dòng tiền',
    function: 'CASHFLOW_VIEW',
    component: CashFlowPage,
  },
  {
    path: '/cash-flow/add',
    exact: true,
    name: 'Thêm mới dòng tiền',
    function: 'CASHFLOW_ADD',
    component: CashFlowAddPage,
  },
  {
    path: '/cash-flow/copy/add/:cash_flow_id',
    exact: true,
    name: 'Sao chép dòng tiền',
    function: 'CASHFLOW_ADD',
    component: CashFlowAddPage,
  },
  {
    path: '/cash-flow/edit/:cash_flow_id',
    exact: true,
    name: 'Chỉnh sửa dòng tiền',
    function: 'CASHFLOW_EDIT',
    component: CashFlowAddPage,
  },
  {
    path: '/cash-flow/detail/:cash_flow_id',
    exact: true,
    name: 'Chi tiết dòng tiền',
    function: 'CASHFLOW_VIEW',
    component: CashFlowAddPage,
  },
];

export default cashFlowRoute;
