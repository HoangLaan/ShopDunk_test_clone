import React from 'react';

const PermissionsPage = React.lazy(() => import('pages/Permissions/PermissionsPage'));

const PositionRoutes = [
  {
    path: '/permissions',
    exact: true,
    name: 'Phân quyền',
    function: 'MD_PERMISSIONS_PAGE',
    component: PermissionsPage,
  }
];

export default PositionRoutes;
