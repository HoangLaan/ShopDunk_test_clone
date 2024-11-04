import React from 'react';

const DefaultPage = React.lazy(() => import('pages/ReconcileDebt/pages/DefaultPage'));

const FunctionGroupRoutes = [
  {
    path: '/reconcile-debt',
    exact: true,
    name: 'Đối trừ chứng từ',
    function: 'RECONCILEDEBT_VIEW',
    component: DefaultPage,
  },
];

export default FunctionGroupRoutes;
