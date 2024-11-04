import React from 'react';
import { PERMISSIONS } from 'pages/ReceiveDebit/utils/permission';

const DefaultPage = React.lazy(() => import('pages/ReceiveDebit/pages/ListPage'));
const DetailPage = React.lazy(() => import('pages/ReceiveDebit/pages/DetailPage'));

const FunctionGroupRoutes = [
  {
    path: '/receive-debit',
    exact: true,
    name: 'Danh sách công nợ phải thu',
    function: PERMISSIONS.AC_RECEIVABLE_VIEW,
    component: DefaultPage,
  },
  {
    path: '/receive-debit/detail',
    exact: true,
    name: 'Chi tiết công nợ phải thu',
    function: PERMISSIONS.AC_RECEIVABLE_VIEW,
    component: DetailPage,
  },
];

export default FunctionGroupRoutes;
