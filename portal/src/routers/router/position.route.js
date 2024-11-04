import React from 'react';

const PositionPage = React.lazy(() => import('pages/Position/PositionPage'));
const PositionAddPage = React.lazy(() => import('pages/Position/PositionAddPage'));

const PositionRoutes = [
  {
    path: '/position',
    exact: true,
    name: 'Danh sách vị trí',
    function: 'MD_POSITION_VIEW',
    component: PositionPage,
  },
  {
    path: '/position/add',
    exact: true,
    name: 'Thêm mới vị trí',
    function: 'MD_POSITION_ADD',
    component: PositionAddPage,
  },
  {
    path: '/position/edit/:position_id',
    exact: true,
    name: 'Chỉnh sửa vị trí',
    function: 'MD_POSITION_EDIT',
    component: PositionAddPage,
  },
  {
    path: '/position/detail/:position_id',
    exact: true,
    name: 'Chi tiết vị trí',
    function: 'MD_POSITION_VIEW',
    component: PositionAddPage,
  },
];

export default PositionRoutes;
