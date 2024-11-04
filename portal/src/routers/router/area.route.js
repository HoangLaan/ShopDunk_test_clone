import React from 'react';

const AreaPage = React.lazy(() => import('pages/Area/AreaPage'));
const AreaAddPage = React.lazy(() => import('pages/Area/AreaAddPage'));

const FunctionGroupRoutes = [
  {
    path: '/area',
    exact: true,
    name: 'Danh sách khu vực',
    function: 'MD_AREA_VIEW',
    component: AreaPage,
  },
  {
    path: '/area/add',
    exact: true,
    name: 'Thêm mới khu vực',
    function: 'MD_AREA_ADD',
    component: AreaAddPage,
  },
  {
    path: '/area/detail/:area_id',
    exact: true,
    name: 'Chi tiết khu vực',
    function: 'MD_AREA_VIEW',
    component: AreaAddPage,
  },
  {
    path: '/area/edit/:area_id',
    exact: true,
    name: 'Chỉnh sửa khu vực',
    function: 'MD_AREA_EDIT',
    component: AreaAddPage,
  },
];

export default FunctionGroupRoutes;
