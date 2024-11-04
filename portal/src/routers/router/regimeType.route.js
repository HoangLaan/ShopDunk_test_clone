import React from 'react';

const RegimeTypeAddPage = React.lazy(() => import('pages/RegimeType/RegimeTypeAddPage'));
const RegimeTypePage = React.lazy(() => import('pages/RegimeType/RegimeTypePage'));

const regimeTypeRoute = [
  {
    path: '/regime-type',
    exact: true,
    name: 'Danh sách loại chế độ',
    function: 'HR_REGIMETYPE_VIEW',
    component: RegimeTypePage,
  },
  {
    path: '/regime-type/add',
    exact: true,
    name: 'Thêm mới loại chế độ',
    function: 'HR_REGIMETYPE_ADD',
    component: RegimeTypeAddPage,
  },
  {
    path: '/regime-type/edit/:regime_type_id',
    exact: true,
    name: 'Chỉnh sửa loại chế độ',
    function: 'HR_REGIMETYPE_EDIT',
    component: RegimeTypeAddPage,
  },
  {
    path: '/regime-type/detail/:regime_type_id',
    exact: true,
    name: 'Xem loại chế độ',
    function: 'HR_REGIMETYPE_VIEW',
    component: RegimeTypeAddPage,
  },
];

export default regimeTypeRoute;
