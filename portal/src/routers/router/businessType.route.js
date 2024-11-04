import React from 'react';

const BusinessType = React.lazy(() => import('pages/BusinessType/BusinessType'));
const BusinessTypeAdd = React.lazy(() => import('pages/BusinessType/BusinessTypeAdd'));
const BusinessTypeDetail = React.lazy(() => import('pages/BusinessType/BusinessTypeDetail'));
const BusinessTypeEdit = React.lazy(() => import('pages/BusinessType/BusinessTypeEdit'));

const BusinessTypeRoutes = [
  {
    path: '/business-type',
    exact: true,
    name: 'Danh sách loại miền',
    function: 'AM_BUSINESSTYPE_VIEW',
    component: BusinessType,
  },
  {
    path: '/business-type/add',
    exact: true,
    name: 'Thêm mới loại miền',
    function: 'AM_BUSINESSTYPE_ADD',
    component: BusinessTypeAdd,
  },
  {
    path: '/business-type/detail/:id',
    exact: true,
    name: 'Chi tiết loại miền',
    function: 'AM_BUSINESSTYPE_VIEW',
    component: BusinessTypeDetail,
  },
  {
    path: '/business-type/edit/:id',
    exact: true,
    name: 'Chỉnh sửa loại miền',
    function: 'AM_BUSINESSTYPE_EDIT',
    component: BusinessTypeEdit,
  },
];

export default BusinessTypeRoutes;
