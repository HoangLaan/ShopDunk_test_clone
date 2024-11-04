import React from 'react';
import { PERMISSION } from 'pages/CustomerLead/utils/constants';

const CustomerLead = React.lazy(() => import('pages/CustomerLead/pages/CustomerLead'));
const CustomerLeadAdd = React.lazy(() => import('pages/CustomerLead/pages/CustomerLeadAdd'));

const customerLeadRoute = [
  {
    path: '/customer-lead',
    exact: true,
    name: 'Danh sách khách hàng tiềm năng',
    function: PERMISSION.VIEW,
    component: CustomerLead,
  },
  {
    path: '/customer-lead/add',
    exact: true,
    name: 'Thêm mới khách hàng tiềm năng',
    function: PERMISSION.ADD,
    component: CustomerLeadAdd,
  },
  {
    path: '/customer-lead/edit/:data_leads_id',
    exact: true,
    name: 'Chỉnh sửa khách hàng tiềm năng',
    function: PERMISSION.EDIT,
    component: CustomerLeadAdd,
  },
  {
    path: '/customer-lead/detail/:data_leads_id',
    exact: true,
    name: 'Chi tiết khách hàng tiềm năng',
    function: PERMISSION.VIEW,
    component: CustomerLeadAdd,
  },
];

export default customerLeadRoute;
