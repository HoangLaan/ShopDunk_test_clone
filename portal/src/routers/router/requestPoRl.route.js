import React from 'react';

const RequestPoRLPage = React.lazy(() => import('pages/RequestPoRL/pages/RequestPoRLPage'));
const RequestAddPoPage = React.lazy(() => import('pages/RequestPoRL/pages/RequestPoAddPage'));

const requestPoRoute = [
  {
    path: '/request-po-rl',
    exact: true,
    name: 'Danh sách mức duyệt mua hàng',
    function: '',
    component: RequestPoRLPage,
  },
  {
    path: '/request-po-rl/add',
    exact: true,
    name: 'Thêm mới mức duyệt mua hàng',
    function: '',
    component: RequestAddPoPage,
  },
  {
    path: '/request-po-rl/edit/:id',
    exact: true,
    name: 'Chỉnh sửa mức duyệt mua hàng',
    function: '',
    component: RequestAddPoPage,
  },
  {
    path: '/request-po-rl/detail/:id',
    exact: true,
    name: 'Chi tiết mức duyệt mua hàng',
    function: '',
    component: RequestAddPoPage,
  },
];

export default requestPoRoute;
