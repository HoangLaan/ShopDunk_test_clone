import React from 'react';

const ReceiveTypeAddPage = React.lazy(() => import('pages/ReceiveType/ReceiveTypeAddPage'));
const ReceiveTypePage = React.lazy(() => import('pages/ReceiveType/ReceiveTypePage'));

const ReceiveTypeRoutes = [
  {
    path: '/receive-type',
    exact: true,
    name: 'Danh sách loại thu',
    function: 'MD_RECEIVETYPE_VIEW',
    component: ReceiveTypePage,
  },
  {
    path: '/receive-type/add',
    exact: true,
    name: 'Thêm mới loại thu',
    function: 'MD_RECEIVETYPE_ADD',
    component: ReceiveTypeAddPage,
  },
  {
    path: '/receive-type/edit/:receive_type_id',
    exact: true,
    name: 'Chỉnh sửa loại thu',
    function: 'MD_RECEIVETYPE_EDIT',
    component: ReceiveTypeAddPage,
  },
  {
    path: '/receive-type/view/:receive_type_id',
    exact: true,
    name: 'Chi tiết loại thu',
    function: 'MD_RECEIVETYPE_VIEW',
    component: ReceiveTypeAddPage,
  },
];

export default ReceiveTypeRoutes;
