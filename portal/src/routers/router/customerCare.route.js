import React from 'react';
import { PERMISSION } from 'pages/CustomerCare/utils/constants';

const CustomerCare = React.lazy(() => import('pages/CustomerCare/pages/CustomerCare'));

const customerCareRoute = [
  {
    path: '/customer-care',
    exact: true,
    name: 'Danh sách chăm sóc khách hàng',
    function: PERMISSION.VIEW,
    component: CustomerCare,
  },
];

export default customerCareRoute;
