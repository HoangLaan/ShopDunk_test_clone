import React from 'react';

const ExpendTypeAddPage = React.lazy(() => import('pages/ExpendType/ExpendTypeAddPage'));
const ExpendTypePage = React.lazy(() => import('pages/ExpendType/ExpendTypePage'));

const expendTypeRoutes = [
  {
    path: '/expend-type',
    exact: true,
    name: 'Danh sách loại chi',
    function: 'MD_EXPENDTYPE_VIEW',
    component: ExpendTypePage,
  },
  {
    path: '/expend-type/add',
    exact: true,
    name: 'Thêm mới loại chi',
    function: 'MD_EXPENDTYPE_ADD',
    component: ExpendTypeAddPage,
  },
  {
    path: '/expend-type/edit/:expend_type_id',
    exact: true,
    name: 'Chỉnh sửa loại chi',
    function: 'MD_EXPENDTYPE_EDIT',
    component: ExpendTypeAddPage,
  },
  {
    path: '/expend-type/view/:expend_type_id',
    exact: true,
    name: 'Chi tiết loại chi',
    function: 'MD_EXPENDTYPE_VIEW',
    component: ExpendTypeAddPage,
  },
];

export default expendTypeRoutes;
