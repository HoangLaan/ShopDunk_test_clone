import React from 'react';

const Material = React.lazy(() => import('pages/Material/Material'));
const MaterialAdd = React.lazy(() => import('pages/Material/MaterialAdd'));

const materialRoutes = [
  {
    path: '/material',
    exact: true,
    name: 'Danh sách túi bao bì',
    function: 'MD_MATERIAL_VIEW',
    component: Material,
  },
  {
    path: '/material/add',
    exact: true,
    name: 'Thêm mới túi bao bì',
    function: 'MD_MATERIAL_ADD',
    component: MaterialAdd,
  },
  {
    path: '/material/detail/:material_id',
    exact: true,
    name: 'Chi tiết túi bao bì',
    function: 'MD_MATERIAL_VIEW',
    component: MaterialAdd,
  },
  {
    path: '/material/edit/:material_id',
    exact: true,
    name: 'Chỉnh sửa túi bao bì',
    function: 'MD_MATERIAL_EDIT',
    component: MaterialAdd,
  },
  {
    path: '/material/add/:material_id',
    exact: true,
    name: 'Sao chép túi bao bì',
    function: 'MD_MATERIAL_ADD',
    component: MaterialAdd,
  },
];

export default materialRoutes;
