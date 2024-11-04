import React from 'react';

const SourceAddPage = React.lazy(() => import('pages/Source/SourceAddPage'));
const SourcePage = React.lazy(() => import('pages/Source/SourcePage'));

const source = [
  {
    path: '/source',
    exact: true,
    name: 'Danh sách nguồn khách hàng',
    function: 'MD_SOURCE_VIEW',
    component: SourcePage,
  },
  {
    path: '/source/add',
    exact: true,
    name: 'Thêm mới nguồn khách hàng',
    function: 'MD_SOURCE_ADD',
    component: SourceAddPage,
  },
  {
    path: '/source/edit/:source_id',
    exact: true,
    name: 'Chỉnh sửa nguồn khách hàng',
    function: 'MD_SOURCE_EDIT',
    component: SourceAddPage,
  },
  {
    path: '/source/detail/:source_id',
    exact: true,
    name: 'Chi tiết nguồn khách hàng',
    function: 'MD_SOURCE_VIEW',
    component: SourceAddPage,
  },
];

export default source;
