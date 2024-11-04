import React from 'react';

const InvoiceManagement = React.lazy(() => import('pages/InvoiceManagement/pages/InvoiceManagement'));

const invoiceManagementRoute = [
  {
    path: '/invoice-management',
    exact: true,
    name: 'Danh sách hóa đơn',
    function: 'INVOICEMANAGER',
    component: InvoiceManagement,
  },
];

export default invoiceManagementRoute;
