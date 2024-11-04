import React from 'react';

const DefaultPage = React.lazy(() => import('pages/RevertReconcileDebt/pages/DefaultPage'));

const FunctionGroupRoutesRevertDebt = [
  {
    path: '/revert-reconcile-debt',
    exact: true,
    name: 'Hủy đối trừ chứng từ',
    function: 'REVERTRECONCILEDEBT_VIEW',
    component: DefaultPage,
  },
];

export default FunctionGroupRoutesRevertDebt;
