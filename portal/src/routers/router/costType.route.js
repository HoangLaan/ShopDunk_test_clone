import React from 'react';

const CostTypePage = React.lazy(() => import('pages/CostType/pages/CostTypePage'));
const CostTypeAdd = React.lazy(() => import('pages/CostType/pages/CostTypeAdd'));
const CostTypeDetail = React.lazy(() => import('pages/CostType/pages/CostTypeDetail'));
const CostTypeEdit = React.lazy(() => import('pages/CostType/pages/CostTypeEdit'));

const CostTypeRoutes = [
  {
    path: '/cost-type',
    exact: true,
    name: 'Danh sách loại chi phí',
    function: 'MD_COSTTYPE_VIEW',
    component: CostTypePage,
  },
  {
    path: '/cost-type/add',
    exact: true,
    name: 'Thêm mới loại chi phí',
    function: 'MD_COSTTYPE_ADD',
    component: CostTypeAdd,
  },
  {
    path: '/cost-type/detail/:id',
    exact: true,
    name: 'Chi tiết loại chi phí',
    function: 'MD_COSTTYPE_VIEW',
    component: CostTypeDetail,
  },
  {
    path: '/cost-type/edit/:id',
    exact: true,
    name: 'Chỉnh sửa loại chi phí',
    function: 'MD_COSTTYPE_UPDATE',
    component: CostTypeEdit,
  },
];

export default CostTypeRoutes;
