import React from 'react';

const PositionLevelPage = React.lazy(() => import('pages/PositionLevel/PositionLevelPage'));
const PositionLevelAddPage = React.lazy(() => import('pages/PositionLevel/PositionLevelAddPage'));

const PositionLevelRoutes = [
  {
    path: '/position-level',
    exact: true,
    name: 'Danh sách cấp bậc nhân viên',
    function: 'MD_POSITIONLEVEL_VIEW',
    component: PositionLevelPage,
  },
  {
    path: '/position-level/add',
    exact: true,
    name: 'Thêm cấp bậc nhân viên',
    function: 'MD_POSITIONLEVEL_ADD',
    component: PositionLevelAddPage,
  },
  {
    path: '/position-level/detail/:position_level_id',
    exact: true,
    name: 'Chi tiết cấp bậc nhân viên',
    function: 'MD_POSITIONLEVEL_VIEW',
    component: PositionLevelAddPage,
  },
  {
    path: '/position-level/edit/:position_level_id',
    exact: true,
    name: 'Chỉnh sửa cấp bậc nhân viên',
    function: 'MD_POSITIONLEVEL_EDIT',
    component: PositionLevelAddPage,
  },
];

export default PositionLevelRoutes;
