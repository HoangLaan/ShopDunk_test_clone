import React from 'react';

const BlockPage = React.lazy(() => import('pages/Block/BlockPage'));
const BlockAddPage = React.lazy(() => import('pages/Block/BlockAddPage'));

const block = [
  {
    path: '/block',
    exact: true,
    name: 'Danh sách khối',
    function: 'MD_BLOCK_VIEW',
    component: BlockPage,
  },
  {
    path: '/block/add',
    exact: true,
    name: 'Thêm mới khối',
    function: 'MD_BLOCK_ADD',
    component: BlockAddPage,
  },
  {
    path: '/block/edit/:block_id',
    exact: true,
    name: 'Chỉnh sửa khối',
    function: 'MD_BLOCK_EDIT',
    component: BlockAddPage,
  },
  {
    path: '/block/detail/:block_id',
    exact: true,
    name: 'Chi tiết khối',
    function: 'MD_BLOCK_VIEW',
    component: BlockAddPage,
  },
];

export default block;
