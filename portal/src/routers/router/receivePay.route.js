import React from 'react';
import { PERMISSIONS } from 'pages/ReceivePay/utils/permission';

const DefaultPage = React.lazy(() => import('pages/ReceivePay/pages/ListPage'));
const DetailPage = React.lazy(() => import('pages/ReceivePay/pages/DetailPage'));

const FunctionGroupRoutes = [
  {
    path: '/receive-pay',
    exact: true,
    name: 'Danh sách công nợ phải trả (Kế toán)',
    function: PERMISSIONS.SL_RECEIVEPAY_VIEW,
    component: DefaultPage,
  },
  {
    path: '/receive-pay/detail',
    exact: true,
    name: 'Chi tiết công nợ phải trả (Kế toán)',
    function: PERMISSIONS.SL_RECEIVEPAY_VIEW,
    component: DetailPage,
  },
];

export default FunctionGroupRoutes;
