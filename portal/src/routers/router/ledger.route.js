import React from 'react';

const LedgerPage = React.lazy(() => import('pages/Ledger/pages/ListPage'));

const ledgerRoute = [
  {
    path: '/ledger',
    exact: true,
    name: 'Sổ nhật ký chung',
    function: 'LEDGER_VIEW',
    component: LedgerPage,
  },
];

export default ledgerRoute;
