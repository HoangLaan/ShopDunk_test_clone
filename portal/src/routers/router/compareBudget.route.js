import React from 'react';

const ListPage = React.lazy(() => import('pages/CompareBudget/pages/ListPage'));

const FunctionGroupRoutes = [
  {
    path: '/compare-budget',
    exact: true,
    name: 'Bảng so sánh ngân sách',
    function: 'COMPAREBUDGET_VIEW',
    component: ListPage,
  },
];

export default FunctionGroupRoutes;
