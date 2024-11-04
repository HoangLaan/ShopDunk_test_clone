import React from 'react';

const websiteDirectoryPage = React.lazy(() => import('pages/websiteDirectory/pages/websiteDirectoryPage'));
const websiteDirectoryAdd = React.lazy(() => import('pages/websiteDirectory/pages/websiteDirectoryAdd'));
const websiteDirectoryEdit = React.lazy(() => import('pages/websiteDirectory/pages/websiteDirectoryEdit'));
const websiteDirectoryDetail = React.lazy(() => import('pages/websiteDirectory/pages/websiteDirectoryDetail'));

const websiteDirectory = [
  {
    path: '/menu-website',
    exact: true,
    name: 'Danh sách danh mục website',
    function: 'SL_ORDER_VIEW',
    component: websiteDirectoryPage,
  },
  {
    path: '/menu-website/add',
    exact: true,
    name: 'Thêm mới danh mục website',
    function: 'SL_ORDER_ADD',
    component: websiteDirectoryAdd,
  },
  {
    path: '/menu-website/edit/:id',
    exact: true,
    name: 'Chỉnh sửa danh mục website',
    function: 'SL_ORDER_EDIT',
    component: websiteDirectoryEdit,
  },
  {
    path: '/menu-website/detail/:id',
    exact: true,
    name: 'Chi tiết danh mục website',
    function: 'SL_ORDER_EDIT',
    component: websiteDirectoryDetail,
  },
];

export default websiteDirectory;
