import React from 'react';

const BusinessPage = React.lazy(() => import('pages/Business/BusinessPage'));
const BusinessAddPage = React.lazy(() => import('pages/Business/BusinessAddPage'));

const businessRoutes = [
  {
    path: '/business',
    exact: true,
    name: 'Danh sách miền ',
    function: 'AM_BUSINESS_VIEW',
    component: BusinessPage,
  },
  {
    path: '/business/add',
    exact: true,
    name: 'Thêm mới miền',
    function: 'AM_BUSINESS_ADD',
    component: BusinessAddPage,
  },
  {
    path: '/business/detail/:business_id',
    exact: true,
    name: 'Chi tiết miền',
    function: 'AM_BUSINESS_VIEW',
    component: BusinessAddPage,
  },
  {
    path: '/business/edit/:business_id',
    exact: true,
    name: 'Chỉnh sửa miền',
    function: 'AM_BUSINESS_EDIT',
    component: BusinessAddPage,
  },
];

export default businessRoutes;
