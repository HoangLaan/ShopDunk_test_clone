import React from 'react';

const ShortLinkAddPage = React.lazy(() => import('pages/ShortLink/ShortLinkAddPage'));
const ShortLinkPage = React.lazy(() => import('pages/ShortLink/ShortLinkPage'));


const shortLinkRoute = [
  {
    path: '/short-link/add',
    exact: true,
    name: 'Thêm mới link rút gọn',
    function: 'SH_SHORTLINK_ADD',
    component: ShortLinkAddPage,
  },
  {
    path: '/short-link',
    exact: true,
    name: 'Danh sách link rút gọn',
    function: 'SH_SHORTLINK_VIEW',
    component: ShortLinkPage,
  },
  {
    path: '/short-link/detail/:id',
    exact: true,
    name: 'Chi tiết link rút gọn',
    function: 'SH_SHORTLINK_VIEW',
    component: ShortLinkAddPage,
  },
  {
    path: '/short-link/edit/:id',
    exact: true,
    name: 'Chỉnh sửa link rút gọn',
    function: 'SH_SHORTLINK_EDIT',
    component: ShortLinkAddPage,
  }
];

export default shortLinkRoute;
