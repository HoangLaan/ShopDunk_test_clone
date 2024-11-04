import React from 'react';
import { CUSTOMER_DEPOSIT_PERMISSION } from 'pages/CustomerDeposit/utils/constants';

const CustomerDeposit = React.lazy(() => import('pages/CustomerDeposit/pages/CustomerDeposit'));

const customerDepositRoute = [
  {
    path: '/customer-deposit',
    exact: true,
    name: 'Danh sách khách hàng đặt cọc',
    function: CUSTOMER_DEPOSIT_PERMISSION.VIEW,
    component: CustomerDeposit,
  },
];

export default customerDepositRoute;
