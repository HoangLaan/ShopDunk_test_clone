import React from 'react';

const PayDebitPage = React.lazy(() => import('pages/PayDebit/PayDebitPage'));
const PayDebitAddPage = React.lazy(() => import('pages/PayDebit/PayDebitAddPage'));

const debitRoute = [
  {
    path: '/pay-debit',
    exact: true,
    name: 'Danh sách công nợ phải trả theo hóa đơn',
    function: 'MD_DEBIT_PAY_VIEW',
    component: PayDebitPage,
  },
  {
    path: '/pay-debit/detail/:debit_id',
    exact: true,
    name: 'Danh sách phiếu chi',
    function: 'MD_DEBIT_PAY_VIEW',
    component: PayDebitAddPage,
  },
];

export default debitRoute;
