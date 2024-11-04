import React from 'react';

const staticContent = React.lazy(() => import('pages/StaticContent/StaticContent'));
const staticContentAdd = React.lazy(() => import('pages/StaticContent/StaticContentAdd'));
const staticContentEdit = React.lazy(() => import('pages/StaticContent/StaticContentEdit'));
const staticContentDetail = React.lazy(() => import('pages/StaticContent/StaticContentDetail'));

const staticContentRoute = [
  {
    path: '/list-staticcontent',
    exact: true,
    name: 'Danh sách trang tĩnh',
    function: 'CMS_STATICCONTENT_VIEW',
    component: staticContent,
  },
  {
    path: '/static/add',
    exact: true,
    name: 'Tạo mới trang tĩnh',
    function: 'CMS_STATICCONTENT_ADD',
    component: staticContentAdd,
  },
  {
    path: '/static/detail/:id',
    exact: true,
    name: 'Chi tiết trang tĩnh',
    function: 'CMS_STATICCONTENT_VIEW',
    component: staticContentDetail,
  },
  {
    path: '/static/edit/:id',
    exact: true,
    name: 'Chỉnh sửa trang tĩnh',
    function: 'CMS_STATICCONTENT_EDIT',
    component: staticContentEdit,
  },
];

export default staticContentRoute;
