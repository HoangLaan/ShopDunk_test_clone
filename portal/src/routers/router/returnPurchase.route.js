import React from 'react';

const ReturnPurchasePage = React.lazy(() => import('pages/ReturnPurchase'));

const prefix = '/return-purchase';
const routes = [
  {
    path: prefix,
    exact: true,
    name: 'Chứng từ trả lại hàng mua',
    function: 'HR_RETURNPURCHASE_VIEW',
    component: ReturnPurchasePage,
  },
];

export default routes;
