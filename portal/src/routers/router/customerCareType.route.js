import React from 'react';

const CustomerCareTypeAddPage = React.lazy(() => import('pages/CustomerCareType/CustomerCareTypeAddPage'));
const CustomerCareTypePage = React.lazy(() => import('pages/CustomerCareType/CustomerCareTypePage'));

const customerCareType = [
  {
    path: '/customer-care-type',
    exact: true,
    name: 'Danh sách loại chăm sóc khách hàng',
    function: 'CRM_CUSTOMERCARETYPE_VIEW',
    component: CustomerCareTypePage,
  },
  {
    path: '/customer-care-type/add',
    exact: true,
    name: 'Thêm loại chăm sóc khách hàng',
    function: 'CRM_CUSTOMERCARETYPE_ADD',
    component: CustomerCareTypeAddPage,
  },
  {
    path: '/customer-care-type/edit/:customer_care_type_id',
    exact: true,
    name: 'Sửa loại chăm sóc khách hàng',
    function: 'CRM_CUSTOMERCARETYPE_EDIT',
    component: CustomerCareTypeAddPage,
  },
  {
    path: '/customer-care-type/detail/:customer_care_type_id',
    exact: true,
    name: 'Xem loại chăm sóc khách hàng',
    function: 'CRM_CUSTOMERCARETYPE_VIEW',
    component: CustomerCareTypeAddPage,
  },
];

export default customerCareType;
