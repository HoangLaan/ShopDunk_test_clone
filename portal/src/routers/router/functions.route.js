import React from 'react';

const FunctionsAddPage = React.lazy(() => import('pages/Functions/FunctionsAddPage'));
const FunctionsPage = React.lazy(() => import('pages/Functions/FunctionsPage'));

const functions = [
  {
    path: '/functions',
    exact: true,
    name: 'Danh sách quyền',
    function: 'SYS_FUNCTION_VIEW',
    component: FunctionsPage,
  },
  {
    path: '/functions/add',
    exact: true,
    name: 'Thêm mới quyền',
    function: 'SYS_FUNCTION_ADD',
    component: FunctionsAddPage,
  },
  {
    path: '/functions/edit/:function_id',
    exact: true,
    name: 'Chỉnh sửa quyền',
    function: 'SYS_FUNCTION_EDIT',
    component: FunctionsAddPage,
  },
  {
    path: '/functions/detail/:function_id',
    exact: true,
    name: 'Chi tiết quyền',
    function: 'SYS_FUNCTION_VIEW',
    component: FunctionsAddPage,
  },
];

export default functions;
